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
import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HapticFeedback } from "../assets/Settings";
import { colors, styles } from "../assets/Styles";


const PERSISTENCE_KEY = 'GAME_IN_PROGRESS';

function GameScreen({navigation, route}) {

    const [isReady, setIsReady] = React.useState(false);

    const [isValid, setIsValid] = React.useState(false);

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

    //Remembers scores if app was closed mid game
    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                const state = savedStateString
                ? JSON.parse(savedStateString)
                : undefined;
        
                if (state !== undefined) {
                    setItems(state);
                    setIsValid(state.every(item => item.score > 0));
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
                                    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(items));
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
                                    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(items));
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
                                        onPress: () => {
                                            RNFS.writeFile(
                                                RNFS.DownloadDirectoryPath + '/friba/' + route.params["time"] + '_' + name +'.txt',
                                                JSON.stringify(items),
                                                'utf8')
                                            .then((success) => {
                                                AsyncStorage.removeItem(PERSISTENCE_KEY)
                                                navigation.navigate('ScoreScreen');
                                            })
                                            .catch((error) => {
                                                //console.log(error.message);
                                            });
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
                                            AsyncStorage.removeItem(PERSISTENCE_KEY)
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
