import React, { useState } from "react";
import { 
  View,
  SafeAreaView,
} from "react-native";
import { 
    Divider,
    Text, 
    Switch 
} from 'react-native-paper';

import { styles } from "../assets/styles";


function SettingsScreen({navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => ! previousState);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.screen}>
            <Text style={styles.categoryText}>
                App Settings
            </Text>
            <Divider bold/>
            <View style={styles.option}>
                <Text style={styles.settingText}>
                    Haptic feedback
                </Text>
                <Switch
                onValueChange={toggleSwitch}
                value={isEnabled}/>
                {/**Laita säätämään asetusta myös
                 * 
                 * Ei tee mitään atm
                 */}
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
  