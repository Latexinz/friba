import React from "react";
import { 
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { 
    DataTable, 
    Icon, 
    Button,
    ActivityIndicator 
} from "react-native-paper";
import { usePreventRemove } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from 'react-native-base64';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GDrive, APP_DATA_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper';

import { HapticFeedback } from "../assets/Settings";
import { colors, styles } from "../assets/Styles";


const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
const IN_PROGRESS_KEY = 'GAME_IN_PROGRESS';
const USER_KEY = 'USER_STATE';

function GameScreen({navigation, route}: any) {

    const [isReady, setIsReady] = React.useState(false);

    const [isValid, setIsValid] = React.useState(false);

    const gdrive = new GDrive();
    const [useDrive, setUseDrive] = React.useState(false);

    const [items, setItems] = React.useState(route.params["params"]);
    const name: string = route.params["name"];
    const par: string = route.params["par"];

    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([32]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    usePreventRemove(true, () => {});

    //This updates the score for a hole whenever the user presses either + or -
    const updateScore = (hole: string, score: number) => {
        setItems(
            items.map((item: any) => {
                if (item.hole === hole) {
                    return { ...item, score };
                } else {
                    return item;
                }
            })
        );
    };

    //If screen out of focus FE going to settings and coming back
    //check states again
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const restoreState = async () => {
                try {
                    const savedStateString = await AsyncStorage.multiGet([IN_PROGRESS_KEY, USER_KEY]);
                    //Check states if app closed while game in progress
                    //multiGet returns a nested array with key as index 0 and value as index 1
                    const previousState = savedStateString[0][1]
                    ? JSON.parse(savedStateString[0][1])
                    : undefined;
                    const user = savedStateString[1][1]
                    ? JSON.parse(savedStateString[1][1])
                    : undefined;
            
                    if (previousState !== undefined) { //restore state
                        setItems(previousState);
                        setIsValid(previousState.every(item => item.score > 0));
                    } else {
                        const state = navigation.getState();
                        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)); //set state so if app closed mid game, return here
                    }
                    if (user !== undefined) {
                        setUseDrive(true);
                    } else {
                        setUseDrive(false);
                    }
                } finally {
                    setIsReady(true);
                }
            };
            if (!isReady) {
                restoreState();
            }
        });
        return unsubscribe;
    }, [navigation]);

    //Activity indicator while restoring state
    if (!isReady) {
        return (
            <View style={{paddingVertical:'100%'}}>
                <ActivityIndicator size={70} color={colors.fribaGreen}/>
            </View>
        );
      }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.screen}>
                <View style={styles.option}>
                    <Text style={styles.settingText}>
                        {name + '\n'}
                        Score: {items.reduce((n: number, {score}: any) => n + score, 0)} / {par+'\t'}  {isValid ? items.reduce((n: number, {score}: any) => n + score, 0) - parseInt(par) : ''}
                    </Text>
                </View>
                <View style={styles.option}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title textStyle={{fontSize:20, color:'black'}}>Hole</DataTable.Title>
                            <DataTable.Title textStyle={{fontSize:20, color:'black'}}>Dist</DataTable.Title>
                            <DataTable.Title style={{justifyContent: 'center'}} textStyle={{fontSize:20, color:'black'}}>Score</DataTable.Title>
                            <DataTable.Title textStyle={{fontSize:20, color:'black'}} numeric>Par</DataTable.Title>
                        </DataTable.Header>

                        <ScrollView style={{height:'75%'}} persistentScrollbar={true}>
                            {items.slice(from, to).map((item: any) => (
                                <DataTable.Row key={item.hole}>
                                <DataTable.Cell textStyle={{fontSize:20, color:'black'}}>{item.hole}</DataTable.Cell>
                                <DataTable.Cell textStyle={{fontSize:20, color:'black'}}>{item.distance}m</DataTable.Cell>
                                <DataTable.Cell style={{justifyContent: 'center', alignItems:'center'}} textStyle={{fontSize:40}}>
                                    <Pressable onPressIn={() => {
                                        if (item.score > 0) {
                                            updateScore(item.hole, item.score-1);
                                            HapticFeedback();
                                        };
                                    }}
                                    onPressOut={() => {
                                        setIsValid(items.every(item => item.score > 0));
                                        AsyncStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(items));
                                    }}>
                                        <Icon 
                                        source='minus-circle'
                                        color={colors.fribaGrey}
                                        size={30}/>
                                    </Pressable>
                                    {item.score}
                                    <Pressable onPressIn={() => {
                                        if (route.params["max"] === true) {
                                            if (item.score < 10) {
                                                updateScore(item.hole, item.score+1);
                                                HapticFeedback();
                                            }
                                        } else {
                                            updateScore(item.hole, item.score+1);
                                            HapticFeedback();
                                        }
                                    }}
                                    onPressOut={() => {
                                        setIsValid(items.every(item => item.score > 0));
                                        AsyncStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(items));
                                    }}>
                                        <Icon 
                                        source='plus-circle'
                                        color={colors.fribaGrey}
                                        size={30}/>
                                    </Pressable>
                                </DataTable.Cell>
                                <DataTable.Cell textStyle={{fontSize:40, color:'black'}} numeric>{item.par}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </ScrollView>

                        {/**<DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(items.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${items.length}`}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />*/}
                    </DataTable>
                </View>
                <View style={{
                    paddingTop:'180%', 
                    paddingHorizontal:'25%', 
                    alignSelf:'center', 
                    width:'100%', 
                    position:'absolute'
                    }}>
                    <Button
                        mode='contained'
                        buttonColor={colors.fribaRed}
                        onPress={() => {
                            HapticFeedback();
                            if (isValid) {
                                Alert.alert('End game?', 'Score will be saved', [
                                    {
                                        text: 'Yes',
                                        onPress: async () => {
                                            if (useDrive) { //Save to Drive
                                                try {
                                                    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
                                                    gdrive.fetchTimeout = 3000;
                                                    const upload = gdrive.files.newMultipartUploader()
                                                    .setData(base64.encode(JSON.stringify(items)))
                                                    .setRequestBody({
                                                        name: route.params["time"] + '_' + name.replaceAll(' ', '_') +'.json',
                                                        parents: [APP_DATA_FOLDER_ID]
                                                    }).execute();

                                                    return upload;
                                                } catch (error) {
                                                    Alert.alert('Error Uploading to Drive', 'Failed to save score to Google Drive.');
                                                } finally {
                                                    AsyncStorage.multiRemove([IN_PROGRESS_KEY, PERSISTENCE_KEY]);
                                                    setTimeout(() => {
                                                        navigation.navigate('ScoreScreen');
                                                    }, 1000);
                                                }
                                            } else {
                                                Alert.alert('Warning: Score will not be saved.', 'To save the score, press cancel and go into settings to sign into Google.', [
                                                    {
                                                        text: 'OK',
                                                        onPress: () => {
                                                            AsyncStorage.multiRemove([IN_PROGRESS_KEY, PERSISTENCE_KEY]);
                                                            navigation.navigate('HomeScreen');  
                                                        }
                                                    },
                                                    {
                                                        text: 'cancel',
                                                        style: 'cancel'
                                                    }
                                                ]);
                                            }
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    }
                                ]);
                            } else {
                                Alert.alert('All scores not set!', 'End game prematurely?', [
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            AsyncStorage.multiRemove([IN_PROGRESS_KEY, PERSISTENCE_KEY]);
                                            navigation.navigate('HomeScreen')
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    }
                                ]);
                            }
                            
                        }}>
                        End Game
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};
  
  export default GameScreen;
