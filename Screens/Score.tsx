import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { usePreventRemove } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { 
    DataTable, 
    ActivityIndicator, 
    ToggleButton 
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import base64 from 'react-native-base64';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GDrive, APP_DATA_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper'

import { styles, colors } from "../assets/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const USER_KEY = 'USER_STATE';

function ScoreScreen({navigation}) {

    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [items, setItems] = React.useState([]);
    const [lastGame, setLastGame] = React.useState('');
    const [localGames, setLocalGames] = React.useState([{'label': '', 'value': ''}]);

    const [dropValue, setDropValue] = React.useState(lastGame);
    const [dropdownData, setDropdownData] = React.useState([{'label': '', 'value': ''}]);

    const [toggleValue, setToggleValue] = React.useState('local');
    const [toggleDisabled, setToggleDisabled] = React.useState(true);

    const gdrive = new GDrive();
    const [test, setTest] = React.useState('');
    const [driveGames, setDriveGames] = React.useState([{'label': '', 'value': ''}]);

    //Finds all saved games when opening the screen
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async() => {
            //Check for Google login
            const savedString = await AsyncStorage.getItem(USER_KEY);
            const savedUser = savedString
                ? JSON.parse(savedString)
                : undefined;

            if (savedUser !== undefined) { //Get list of files from Drive
                gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
                gdrive.fetchTimeout = 3000;
                const files =  await gdrive.files.list({spaces: APP_DATA_FOLDER_ID});
                let listNames = [];
                for (const data of files.files) {
                    let newListItem = {
                        'label': data.name
                        .replace('.json', '')
                        .replaceAll('_', ' '),
                        'value': data.id
                    }
                    listNames.push(newListItem);
                }
                setDriveGames(listNames);
                //setTest(JSON.stringify(listNames));
                setToggleDisabled(false);
            } else {
                setToggleDisabled(true);
                setToggleValue('local');
            }
            RNFS.readDir(RNFS.DownloadDirectoryPath + '/friba')
            .then((result) => {
                if (result.length > 0) {
                    let names: String[] = [];
                    let listNames = [];
                    for (const data of result) {
                        let newListItem = {
                            'label': data.name
                            .replace('.json', '')
                            .replaceAll('_', ' '),
                            'value': data.name
                        }
                        names.push(data.name);
                        listNames.push(newListItem);
                    }
                    setLocalGames(listNames);
                    setLastGame(
                        JSON.stringify(names[names.length-1])
                        .replaceAll('"', '')
                        .replace('.json', '')
                        .replaceAll('_', ' ')
                    );
                    setDropdownData(listNames);
                    return RNFS.readFile(RNFS.DownloadDirectoryPath + '/friba/' + JSON.stringify(names[names.length-1]).replaceAll('"', ''), 'utf8')
                    .then((contents) => {
                        setItems(JSON.parse(contents));
                        setSaved(true);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            });
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        if (toggleValue === 'drive') {
            setLastGame(
                JSON.stringify(driveGames[driveGames.length-1].label)
                .replaceAll('"', '')
                .replace('.json', '')
                .replaceAll('_', ' ')
            );
            setDropdownData(driveGames);
        } else {
            setDropdownData(localGames);
        }

    }, [toggleValue]);

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
                <View style={styles.option}>
                    <ToggleButton.Row onValueChange={value => setToggleValue(value)} value={toggleValue}>
                        <ToggleButton icon='folder' value='local' />
                        <ToggleButton icon='google-drive' value='drive' disabled={toggleDisabled}/>
                    </ToggleButton.Row>
                </View>
                <View style={styles.option}>
                <   Text style={styles.descriptionText}>
                        {test}
                    </Text>
                </View>
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
                            data={dropdownData}
                            autoScroll={false}
                            labelField='label'
                            valueField='value'
                            value={dropValue}
                            onChange={async item => {
                                if (toggleValue === 'local') {
                                    RNFS.readFile(RNFS.DownloadDirectoryPath + '/friba/' + item.value, 'utf8')
                                    .then((contents) => {
                                        setItems(JSON.parse(contents));
                                    });
                                    setDropValue(item.value);
                                } else if (toggleValue === 'drive') {
                                    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
                                    gdrive.fetchTimeout = 3000;
                                    await gdrive.files.getText(item.value)
                                    .then((response) => {
                                        setItems(JSON.parse(base64.decode(response)));
                                    });
                                }
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
