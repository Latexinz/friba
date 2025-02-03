import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { usePreventRemove } from '@react-navigation/native';
import { DataTable, ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import base64 from 'react-native-base64';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GDrive, APP_DATA_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles, colors } from "../assets/Styles";


const USER_KEY = 'USER_STATE';

function ScoreScreen({navigation}: any) {

    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [items, setItems] = React.useState([]);
    const [lastGame, setLastGame] = React.useState('');

    const [dropValue, setDropValue] = React.useState(lastGame);
    const [games, setGames] = React.useState([{'label': '', 'value': ''}]);

    const gdrive = new GDrive();

    //Finds all saved games when focusing the screen
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async() => {
            setLoading(true);
            //Check for Google login
            const savedString = await AsyncStorage.getItem(USER_KEY);
            const savedUser = savedString
                ? JSON.parse(savedString)
                : undefined;

            if (savedUser !== undefined) { //Get list of files from Drive
                gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
                gdrive.fetchTimeout = 3000;
                const files =  await gdrive.files.list({spaces: APP_DATA_FOLDER_ID});
                if (files.files.length > 0) { //Saved scores found
                    let names: String[] = []; 
                    let listNames = [];
                    for (const data of files.files) {
                        let newListItem = {
                            'label': data.name
                            .replace('.json', '')
                            .replaceAll('_', ' '),
                            'value': data.id
                        }
                        names.push(data.name);
                        listNames.push(newListItem);
                    }
                    //Get the score for the latest game
                    await gdrive.files.getText(listNames[0].value)
                    .then((response) => {
                        setItems(JSON.parse(base64.decode(response)));
                    });
                    setLastGame(
                        JSON.stringify(names[0])
                        .replaceAll('"', '')
                        .replace('.json', '')
                        .replaceAll('_', ' ')
                    );
                    setGames(listNames);
                    setSaved(true);
                }
            } else {
                setSaved(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [navigation]);

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

    //Hardware backbutton always takes user back to homescreen
    usePreventRemove(true, () => {
        navigation.navigate('HomeScreen');
    });

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.screen}>
                {loading ? <View style={{paddingVertical:'80%'}}>
                    <ActivityIndicator animating={loading} size={70} color={colors.fribaGreen}/>
                </View>
                : saved ? <View>
                    <View style={styles.option}>
                        <Dropdown
                            style={styles.dropdownS}
                            placeholderStyle={styles.settingText}
                            itemTextStyle={styles.settingText}
                            selectedTextStyle={styles.settingText}
                            inputSearchStyle={styles.settingText}
                            searchPlaceholder='search...'
                            placeholder={lastGame}
                            data={games}
                            autoScroll={false}
                            labelField='label'
                            valueField='value'
                            value={dropValue}
                            onChange={async item => {
                                setDropValue(item.value);
                                gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
                                gdrive.fetchTimeout = 3000;
                                await gdrive.files.getText(item.value)
                                .then((response) => {
                                    setItems(JSON.parse(base64.decode(response)));
                                });
                                setPage(0);
                            }}/>
                    </View>
                    <View style={styles.option}>
                        <Text style={styles.settingText}>
                            Score: {items.reduce((n: number, {score}: any) => n + score, 0)}
                        </Text>
                    </View>
                    <View style={styles.option}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title textStyle={{fontSize:20, color:'black'}}>Hole</DataTable.Title>
                                <DataTable.Title textStyle={{fontSize:20, color:'black'}}>Score</DataTable.Title>
                            </DataTable.Header>

                            {items.slice(from, to).map((item: any) => (
                                <DataTable.Row key={item.hole}>
                                    <DataTable.Cell>{item.hole}</DataTable.Cell>
                                    <DataTable.Cell>{item.score}</DataTable.Cell>
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
                </View>
                //Placeholder text when no scores found
                :<View style={{paddingTop: '50%'}}>
                    <Text style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 40,
                        }}>
                        No saved scores found!
                        {'\n\n'}
                        Play a game from start to finish first :)
                    </Text>
                </View>}
            </View>
        </SafeAreaView>
    );
};

export default ScoreScreen;
