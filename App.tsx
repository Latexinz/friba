import React from "react";
import {Alert, View} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton, ActivityIndicator} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { HapticFeedback, ThemeContext } from "./assets/Settings";
import { appColors, themes } from "./assets/Styles";

import {version} from "./package.json";


const Stack = createNativeStackNavigator();

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
const USER_KEY = 'USER_STATE';
const THEME_KEY = 'THEME_STATE';

export default function app() {

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  const [theme, setTheme] = React.useState('Light');
  const themeData = { theme, setTheme };

  React.useEffect(() => {
    //Restore app state if closed mid game
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.multiGet([PERSISTENCE_KEY, THEME_KEY]);
        const state = savedStateString[0][1]
          ? JSON.parse(savedStateString[0][1])
          : undefined;
        const themeState = savedStateString[1][1]
          ? savedStateString[1][1]
          : undefined;

        if (themeState !== undefined) { //Previously set user preference for light/dark mode found
          setTheme(themeState);
        }
        if (state !== undefined) { //Previous state found
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    //Google signin
    const signIn = async () => {
      try {
        GoogleSignin.configure({
          scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.appdata'
          ]
        });
        await GoogleSignin.hasPlayServices();
        const previousSignIn = GoogleSignin.hasPreviousSignIn();
        if (previousSignIn) { //If previous signin found, check for user
          const user = GoogleSignin.getCurrentUser();
          if (user === null) { //Recover user if not found
            const responseSilent = await GoogleSignin.signInSilently();
            if (responseSilent.type === 'success') {
              AsyncStorage.setItem(USER_KEY, JSON.stringify(responseSilent.data.user.email));
            } else if (responseSilent.type === 'noSavedCredentialFound') { //Prompt user here
              const responseLoud = await GoogleSignin.signIn();
              if (responseLoud.type === 'success') {
                AsyncStorage.setItem(USER_KEY, JSON.stringify(responseLoud.data.user.email));
              } else { //Remove user from store
                AsyncStorage.removeItem(USER_KEY);
                Alert.alert('Sign in Cancelled', 'Sign in to Google to save scores. You can do this anytime from settings');
              }
            }
          }
        } else {
          const responseLoud = await GoogleSignin.signIn();
          if (responseLoud.type === 'success') {
            AsyncStorage.setItem(USER_KEY, JSON.stringify(responseLoud.data.user.email));
          } else { //Remove user from store
            AsyncStorage.removeItem(USER_KEY);
            Alert.alert('Sign in Cancelled', 'Sign in to Google to save scores. You can do this anytime from settings');
          }
        }
        restoreState();
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
      signIn();
    }
  }, [isReady]);

  //Display an activity indicator while restoring state
  if (!isReady) {
    return (
      <View style={{paddingVertical:'100%'}}>
        <ActivityIndicator size={70} color={appColors.fribaGreen}/>
      </View>
    );
  }

  return(
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer
        initialState={initialState}
        theme={theme === 'Light' ? themes.light : themes.dark}>
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
                  iconColor={appColors.fribaGrey}
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
                  iconColor={appColors.fribaGrey}
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
            options={({navigation}) =>(
              {
                title: 'Settings',
                //headerLeft: () => (
                //  <IconButton 
                //  icon='arrow-left-bold'
                //  iconColor={colors.fribaGrey}
                //  size={20} 
                //  onPressIn={() => {
                //    HapticFeedback();
                //    navigation.goBack();
                //  }}/>
                //),
              }
            )}/>
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
                  iconColor={appColors.fribaGrey}
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
                  iconColor={appColors.fribaGrey}
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
    </ThemeContext.Provider>
  );
};
