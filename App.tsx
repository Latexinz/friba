import React from "react";
import {StatusBar, View} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton, ActivityIndicator} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNFS from '@dr.pogodin/react-native-fs';

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

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      initDir();
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
