import React from "react";
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
import * as RNFS from '@dr.pogodin/react-native-fs';

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
              buttonColor={colors.fribaRed}
              onPress={() => {
                HapticFeedback();
                Alert.alert('Delete data?', 'All saved data will be removed', [
                  {
                      text: 'Yes',
                      onPress: () => {
                        RNFS.unlink(RNFS.DownloadDirectoryPath + '/friba/')
                        .then(() => {
                          RNFS.mkdir(RNFS.DownloadDirectoryPath + '/friba/')
                        });
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
          <Text style={styles.categoryText}>
            Account Settings
          </Text>
          <Divider bold/>
      </View>
    </SafeAreaView>
  );
};
  
export default SettingsScreen;
  