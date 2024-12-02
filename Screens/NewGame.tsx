import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";

import { styles } from "../assets/styles";

function NewGameScreen({navigation}) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={
        {
          paddingHorizontal:'25%',
          paddingVertical:'20%'
        }}>
        <Text style={{
          color: 'black'
        }}>
          Test
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NewGameScreen;
