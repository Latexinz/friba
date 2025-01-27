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
import { usePreventRemove, useNavigationState } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';
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
    const [numberOfItemsPerPageList] = React.useState([9]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    usePreventRemove(true, () => {});

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

    //If screen out of focus fe going to settings and coming back
    //check states again
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const state = navigation.getState();
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)); //set state so if app closed mid game, return here
            setIsReady(false);
        });
        return unsubscribe;
    }, [navigation]);

    //Remembers scores if app was closed mid game
    //also checks if user logged in to Google
    React.useEffect(() => {
        console.log('Game restored');
        const restoreState = async () => {
            try {
                const savedStateString = await AsyncStorage.multiGet([IN_PROGRESS_KEY, USER_KEY]);
                //multiGet returns a nested array with key as index 0 and value as index 1
                const state = savedStateString[0][1]
                ? JSON.parse(savedStateString[0][1])
                : undefined;
                const user = savedStateString[1][1]
                ? JSON.parse(savedStateString[1][1])
                : undefined;
        
                if (state !== undefined) {
                    setItems(state);
                    setIsValid(state.every(item => item.score > 0));
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
    }, [isReady]);

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
            <ScrollView style={styles.screen}>
                <View style={styles.option}>
                    <Text style={styles.settingText}>
                        {name.replaceAll('_', ' ') + '\n'}
                        Par: {par + '\n'}
                        Score: {items.reduce((n: number, {score}: any) => n + score, 0)}
                    </Text>
                </View>
                <View style={styles.option}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title textStyle={{fontSize:20, color:'black'}}>Hole</DataTable.Title>
                            <DataTable.Title style={{justifyContent: 'center'}} textStyle={{fontSize:20, color:'black'}}>Score</DataTable.Title>
                        </DataTable.Header>

                        {items.slice(from, to).map((item: any) => (
                            <DataTable.Row key={item.hole}>
                            <DataTable.Cell textStyle={{fontSize:20, color:'black'}}>{item.hole}</DataTable.Cell>
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
                            </DataTable.Row>
                        ))}

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(items.length / itemsPerPage)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${items.length}`}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                            showFastPaginationControls
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                </View>
                <View style={
                    {
                    paddingHorizontal:'25%',
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
                                                        name: route.params["time"] + '_' + name +'.json',
                                                        parents: [APP_DATA_FOLDER_ID]
                                                    }).execute();

                                                    return upload;
                                                } catch (error) {
                                                    Alert.alert('Error Uploading to Drive');
                                                } finally {
                                                    //Save to device
                                                    RNFS.writeFile(
                                                        RNFS.DownloadDirectoryPath + '/friba/' + route.params["time"] + '_' + name +'.json',
                                                        JSON.stringify(items),
                                                        'utf8')
                                                    .then((success) => {
                                                        AsyncStorage.multiRemove([IN_PROGRESS_KEY, PERSISTENCE_KEY]);
                                                        navigation.navigate('ScoreScreen');
                                                    })
                                                    .catch((error) => {
                                                        //console.log(error.message);
                                                    });
                                                }
                                            } else {
                                                RNFS.writeFile(
                                                    RNFS.DownloadDirectoryPath + '/friba/' + route.params["time"] + '_' + name +'.json',
                                                    JSON.stringify(items),
                                                    'utf8')
                                                .then((success) => {
                                                    AsyncStorage.multiRemove([IN_PROGRESS_KEY, PERSISTENCE_KEY]);
                                                    navigation.navigate('ScoreScreen');
                                                })
                                                .catch((error) => {
                                                    //console.log(error.message);
                                                });
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
            </ScrollView>
        </SafeAreaView>
    );
};
  
  export default GameScreen;
