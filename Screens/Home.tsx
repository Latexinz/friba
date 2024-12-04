import React from "react";
import { 
  View,
  SafeAreaView,
  Vibration,
} from "react-native";
import { Button } from 'react-native-paper';

import { styles, colors } from "../assets/styles";


function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={
        {
          paddingHorizontal:'25%',
          paddingTop:'90%',
        }}>
        <Button
          mode='contained'
          buttonColor={colors.fribaGreen}
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
