import React from "react";
import { 
  View,
  SafeAreaView,
  Alert,
  Pressable,
} from "react-native";
import { 
    Divider,
    Text,
    Icon,
} from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin, 
  statusCodes,
  isErrorWithCode
} from "@react-native-google-signin/google-signin";

import { HapticFeedback } from "../assets/Settings";
import { styles, colors } from "../assets/Styles";


const USER_KEY = 'USER_STATE';

function SettingsScreen({navigation}: any) {

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] =  React.useState('');

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const user = async () => {
      try {
        const savedString = await AsyncStorage.getItem(USER_KEY);
        const savedUser = savedString
          ? JSON.parse(savedString)
          : undefined;

        if (savedUser !== undefined) {
          setUser(savedUser);
          setLoggedIn(true);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      user();
    }
  }, [isReady]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.categoryText}>
          General
        </Text>
        <Divider bold/>
        <View style={styles.option}>
          <Text style={styles.settingText}>
            <Icon 
              source='volume-high'
              color={colors.fribaGrey}
              size={18}/>
            {'\t'}Volume
          </Text>
        </View>
        <Text style={styles.categoryText}>
          Account
        </Text>
        <Divider bold/>
        <Pressable onPressIn={async() => {
            HapticFeedback();
            if (loggedIn) {
              Alert.alert('Log out?', 'You will need to log back in to use Google Drive.', [
                {
                  text: 'Log out',
                  onPress: async () => {
                    GoogleSignin.configure();
                    await GoogleSignin.signOut();
                    AsyncStorage.removeItem(USER_KEY);
                    setLoggedIn(false);
                    setUser('');
                  }
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ])
            } else {
              try {
                GoogleSignin.configure({
                  scopes: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/drive.file',
                    'https://www.googleapis.com/auth/drive.appdata'
                  ]
                });
                await GoogleSignin.hasPlayServices();
                const response = await GoogleSignin.signIn();
                if (response.type === 'success') {
                  AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user.email));
                  setIsReady(false);
                }
              } catch (error) {
                if (isErrorWithCode(error)) {
                  switch (error.code) {
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                      Alert.alert('Error signing in', 'Play services not available or outdated');
                      break;
                    case statusCodes.SIGN_IN_CANCELLED:
                      Alert.alert('Error signing in', 'Sign in cancelled');
                      break;
                    case statusCodes.IN_PROGRESS:
                      Alert.alert('Error signing in', 'Sign in already in progress');
                      break;
                    default:
                      Alert.alert('Error signing in', 'Unknown error');
                      break;
                  }
                }
              }
            }
        }}>
          <View style={styles.option}>
            <Text style={styles.settingText}>
              <Icon 
                source='google'
                color={colors.fribaGrey}
                size={18}/>
              {'\t'}Google
            </Text>
            <Text style={styles.settingText}>
              <Icon 
                source={loggedIn ? 'check-circle-outline' : 'close-circle-outline'}
                color={loggedIn ? colors.fribaGreen : colors.fribaRed}
                size={24}/>
            </Text>
          </View>
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              {loggedIn ? user : null}
            </Text>
          </View>
        </Pressable>
        <Text style={styles.categoryText}>
          Saved data
        </Text>
        <Divider bold/>
        <Pressable onPressIn={() => {
          HapticFeedback();
          Alert.alert('Delete data?', 'All saved data will be removed', [
            {
              text: 'Yes',
              onPress: () => {
                //Remove data from Drive appdatafolder
              }
            },
            {
              text: 'Cancel',
              style: 'cancel',
            }
          ]);
        }}>
          <View style={styles.option}>
            <Text style={styles.settingText}>
              <Icon 
                source='delete'
                color={colors.fribaGrey}
                size={18}/>
              {'\t'}Delete saved data
            </Text>
          </View>
        </Pressable>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Deletes saved games from the device
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
  
export default SettingsScreen;
  