import React, { useState } from "react";
import { 
  View,
  SafeAreaView,
  Alert
} from "react-native";
import { 
    Divider,
    Text,
    Button 
} from 'react-native-paper';

import { HapticFeedback } from "../assets/Settings";
import { styles, colors } from "../assets/Styles";


function SettingsScreen({navigation}) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
          <Text style={styles.categoryText}>
            App Settings
          </Text>
          <Divider bold/>
          <View style={styles.option}>
            <Text style={styles.settingText}>
              Delete saved data
            </Text>
            <Button
              mode='contained'
              buttonColor={colors.fribaGreen}
              onPress={() => {
                HapticFeedback();
                Alert.alert('Delete data?', 'All saved data will be removed', [
                  {
                      text: 'Yes',
                      onPress: () => {
                      }
                  },
                  {
                      text: 'Cancel',
                      style: 'cancel',
                  }
              ]);
            }}>
              Delete
            </Button>
          </View>
          <View style={styles.option}>
            <Text style={styles.option}>
              Test
            </Text>
          </View>
          <Text style={styles.categoryText}>
            Account Settings
          </Text>
          <Divider bold/>
      </View>
    </SafeAreaView>
  );
};
  
export default SettingsScreen;
  