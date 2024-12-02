import React from "react";
import { 
  View,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
});

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
