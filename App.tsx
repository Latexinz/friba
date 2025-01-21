import React from "react";
import {Alert, StatusBar, View} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton, ActivityIndicator} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNFS from '@dr.pogodin/react-native-fs';
import {
  GoogleSignin, 
  statusCodes, 
  isErrorWithCode 
} from "@react-native-google-signin/google-signin";

import GameScreen from "./Screens/Game";
import HomeScreen from "./Screens/Home";
import SetupScreen from "./Screens/Setup";
import SettingsScreen from "./Screens/Settings";
import ScoreScreen from "./Screens/Score";
import { HapticFeedback } from "./assets/Settings";
import { colors } from "./assets/Styles";

import {version} from "./package.json";


const Stack = createNativeStackNavigator();

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
const USER_KEY = 'USER_STATE';

export default function app() {

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    //Check if dir for saved games exists
    const initDir = async () => {
      const exists = await RNFS.exists(RNFS.DownloadDirectoryPath + '/friba');
      if (!exists) { 
        RNFS.mkdir(RNFS.DownloadDirectoryPath + '/friba');
      }
    };

    //Restore app state if closed and opened again
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) { //Previous state found
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    const user = async () => {
      const savedString = await AsyncStorage.getItem(USER_KEY);
      const savedUser = savedString
        ? JSON.parse(savedString)
        : undefined;

      if (savedUser !== undefined) {
        signIn();
      }
    };

    //Check for google signin
    const signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const previousSignIn = GoogleSignin.hasPreviousSignIn();
        if (previousSignIn) { //If previous signin found, check for user
          const user = GoogleSignin.getCurrentUser();
          if (user === null) { //Recover user if not found
            GoogleSignin.configure();
            const responseSilent = await GoogleSignin.signInSilently();
            if (responseSilent.type === 'success') {
              AsyncStorage.setItem(USER_KEY, JSON.stringify(responseSilent.data.user.email));
            } else if (responseSilent.type === 'noSavedCredentialFound') { //Prompt user here
              const responseLoud = await GoogleSignin.signIn();
              if (responseLoud.type === 'success') {
                AsyncStorage.setItem(USER_KEY, JSON.stringify(responseLoud.data.user.email));
              } else { //Remove user from store
                AsyncStorage.removeItem(USER_KEY);
              }
            }
          }
        }
      } catch (error) { //Error handling
        if (isErrorWithCode(error)) {
          switch (error.code) {
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              Alert.alert('Error signing in', 'Play services not available or outdated');
              break;
            default:
              Alert.alert('Error signing in', 'Unknown error');
              break;
          }
        }
      }
    };

    if (!isReady) {
      initDir();
      user();
      restoreState();
    }
  }, [isReady]);

  //Display an activity indicator while restoring state
  if (!isReady) {
    return (
      <View style={{paddingVertical:'100%'}}>
        <ActivityIndicator size={70} color={colors.fribaGreen}/>
      </View>
    );
  }

  return(
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => 
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }>
      <StatusBar
            backgroundColor={colors.fribaGreen}/>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({navigation}) =>(
            {
              title: 'LÄTTYGOLF v' + version, 
              headerBackVisible: false,
              headerRight: () => (
                <IconButton 
                icon='cog'
                size={20} 
                onPressIn={() => {
                  HapticFeedback();
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
        <Stack.Screen
          name="SetupScreen"
          component={SetupScreen}
          options={({navigation}) =>(
            {
              title: 'New Game Setup',
              headerRight: () => (
                <IconButton 
                icon='cog'
                size={20} 
                onPressIn={() => {
                  HapticFeedback();
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{title: 'Settings'}}/>
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={({navigation}) =>(
            {
              title: 'Game', 
              headerBackVisible: false,
              headerRight: () => (
                <IconButton 
                icon='cog'
                size={20} 
                onPressIn={() => {
                  HapticFeedback();
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
          <Stack.Screen
          name="ScoreScreen"
          component={ScoreScreen}
          options={({navigation}) =>(
            {
              title: 'Scores', 
              headerBackVisible: false,
              headerRight: () => (
                <IconButton 
                icon='cog'
                size={20} 
                onPressIn={() => {
                  HapticFeedback();
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
