import React from "react";
import { 
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Vibration,
  Pressable,
  Alert,
} from "react-native";
import { 
    DataTable, 
    Icon, 
    Button 
} from "react-native-paper";
import { usePreventRemove } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';

import { colors, styles } from "../assets/styles";


function GameScreen({navigation, route}) {

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.screen}>
                <View style={styles.option}>
                    <Text style={styles.settingText}>
                        {name.replaceAll('_', ' ') + '\n'}
                        Par: {par + '\n'}
                        Total Score: {items.reduce((n: number, {score}: any) => n + score, 0)}
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
                                        Vibration.vibrate(50);
                                    };
                                }}
                                onPressOut={() => {
                                    setIsValid(items.every(item => item.score > 0));
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
                                            Vibration.vibrate(50);
                                        }
                                    } else {
                                        updateScore(item.hole, item.score+1);
                                        Vibration.vibrate(50);
                                    }
                                }}
                                onPressOut={() => {
                                    setIsValid(items.every(item => item.score > 0));
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
                        buttonColor={colors.fribaGreen}
                        onPress={() => {
                            Vibration.vibrate(50);
                            if (isValid) {
                                Alert.alert('End game?', 'Score will be saved', [
                                    {
                                        text: 'Yes',
                                        onPress: () => {
                                            RNFS.writeFile(
                                                RNFS.DocumentDirectoryPath + '/' + name + '_' + route.params["time"] +'.txt',
                                                JSON.stringify(items),
                                                'utf8')
                                            .then((success) => {
                                                navigation.navigate('HomeScreen');
                                            })
                                            .catch((error) => {
                                                console.log(error.message);
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
                                        onPress: () => navigation.navigate('HomeScreen')
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
