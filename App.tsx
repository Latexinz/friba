import React from "react";
import {StatusBar, Vibration} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons';

import HomeScreen from "./Screens/Home";
import NewGameScreen from "./Screens/NewGame";
import SettingsScreen from "./Screens/Settings";

import {version} from "./package.json";

const Stack = createNativeStackNavigator();

export default function app() {
  return(
    <NavigationContainer>
      <StatusBar
            backgroundColor='#449e48'/>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({navigation}) =>(
            {
              title: 'LÄTTYGOLF v' + version, 
              headerRight: () => (
                <IconButton icon='info' onPress={() => {
                  Vibration.vibrate(50);
                  navigation.navigate('SettingsScreen')
                }}/>
              ),
            }
          )}/>
        <Stack.Screen
          name="NewGameScreen"
          component={NewGameScreen}
          options={{title: 'Create New Game'}}/>
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{title: 'Settings'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
