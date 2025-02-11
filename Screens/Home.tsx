import React from "react";
import { 
  View, 
  SafeAreaView,
} from "react-native";
import { Button } from 'react-native-paper';
import { usePreventRemove } from '@react-navigation/native';

import { HapticFeedback } from "../assets/Settings";
import { styles, appColors } from "../assets/Styles";


function HomeScreen({navigation}: any) {

  usePreventRemove(true, () => {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={
        {
          paddingHorizontal:'20%',
          paddingTop:'80%',
        }}>
        <Button
          mode='contained'
          buttonColor={appColors.fribaGreen}
          onPress={() => {
            HapticFeedback();
            navigation.navigate('SetupScreen');
          }}>
          New Game
        </Button>
      </View>
      <View style={
      {
        paddingHorizontal:'20%',
        paddingTop:'5%',
      }}>
        <Button
          mode='contained'
          buttonColor={appColors.fribaGreen}
          onPress={() => {
            HapticFeedback();
            navigation.navigate('ScoreScreen');
          }}>
          Scores
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
