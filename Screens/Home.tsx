import React from "react";
import { 
  View,
  SafeAreaView,
  StyleSheet,
  Vibration,
} from "react-native";
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
});

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
