import React from "react";
import {StatusBar, Vibration} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton} from 'react-native-paper';

import GameScreen from "./Screens/Game";
import HomeScreen from "./Screens/Home";
import SetupScreen from "./Screens/Setup";
import SettingsScreen from "./Screens/Settings";
import ScoreScreen from "./Screens/Score";
import { colors } from "./assets/styles";

import {version} from "./package.json";


const Stack = createNativeStackNavigator();

export default function app() {
  return(
    <NavigationContainer>
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
                onPress={() => {
                  Vibration.vibrate(50);
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
                onPress={() => {
                  Vibration.vibrate(50);
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
                onPress={() => {
                  Vibration.vibrate(50);
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
                onPress={() => {
                  Vibration.vibrate(50);
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
