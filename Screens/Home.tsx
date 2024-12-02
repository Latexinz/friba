import React from "react";
import { 
  View,
  SafeAreaView,
  Vibration,
} from "react-native";
import { Button } from 'react-native-paper';

import { styles } from "../assets/styles";


function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={
        {
          paddingHorizontal:'25%',
          paddingTop:'10%',
          paddingBottom:'5%'
        }}>
        <Button
          onPress={() => {
            Vibration.vibrate(50);
            navigation.navigate('NewGameScreen');
          }}>
            New Game
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
