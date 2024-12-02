import React, { useState } from "react";
import { 
  View,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { 
    Divider,
    Text, 
    Switch 
} from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent:'center',
    },
    categoryText: {
    color:'gray',
        fontSize: 24
    },
    settingText: {
        color:'black',
        fontSize: 18
    },
    switch: {
        flexDirection:'row',
        paddingVertical:'3%',
        justifyContent:'space-between'
    }
});

function SettingsScreen({navigation}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => ! previousState);

    return (
      <SafeAreaView style={styles.container}>
        <View style={{
            paddingHorizontal:'5%',
            paddingVertical:'5%',
        }}>
            <Text style={styles.categoryText}>
                App Settings
            </Text>
            <Divider bold/>
            <View style={styles.switch}>
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
  