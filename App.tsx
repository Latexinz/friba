import React from "react";
import {StatusBar, Vibration} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {IconButton} from 'react-native-paper';

import HomeScreen from "./Screens/Home";
import NewGameScreen from "./Screens/NewGame";
import SettingsScreen from "./Screens/Settings";
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
