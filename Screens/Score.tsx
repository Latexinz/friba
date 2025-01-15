import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
  ScrollView
} from "react-native";
import { usePreventRemove } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { DataTable, ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { styles, colors } from "../assets/Styles";


function ScoreScreen({navigation}) {

    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [items, setItems] = React.useState([]);
    const [lastGame, setLastGame] = React.useState('');
    const [allGames, setAllGames] = React.useState([{'label': '', 'value': ''}]);

    const [value, setValue] = React.useState(lastGame);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            RNFS.readDir(RNFS.DownloadDirectoryPath)
            .then((result) => {
                if (result.length > 0) {
                    let names: String[] = [];
                    let listNames = [];
                    for (const data of result) {
                        let newListItem = {
                            'label': data.name
                            .replace('.txt', '')
                            .replaceAll('_', ' '),
                            'value': data.name
                        }
                        names.push(data.name);
                        listNames.push(newListItem);
                    }
                    setAllGames(listNames);
                    setLastGame(
                        JSON.stringify(names[names.length-1])
                        .replaceAll('"', '')
                        .replace('.txt', '')
                        .replaceAll('_', ' ')
                    );
                    return RNFS.readFile(RNFS.DownloadDirectoryPath + '/' + JSON.stringify(names[names.length-1]).replaceAll('"', ''), 'utf8')
                    .then((contents) => {
                        setItems(JSON.parse(contents));
                        setSaved(true);
                        setLoading(false);
                    });
                } else {
                    setLoading(false);
                }
            })
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

    usePreventRemove(true, () => {
        navigation.navigate('HomeScreen');
    });

    return(
        <SafeAreaView style={styles.container}>
            {loading ? <View style={{paddingVertical:'80%'}}>
                <ActivityIndicator animating={loading} size={70} color={colors.fribaGreen}/>
            </View>
            : saved ? <ScrollView style={styles.screen}>
                <View style={styles.option}>
                    <Dropdown
                        style={styles.dropdownS}
                        placeholderStyle={styles.settingText}
                        itemTextStyle={styles.settingText}
                        selectedTextStyle={styles.settingText}
                        inputSearchStyle={styles.settingText}
                        searchPlaceholder='search...'
                        placeholder={lastGame}
                        data={allGames}
                        autoScroll={false}
                        labelField='label'
                        valueField='value'
                        value={value}
                        onChange={item => {
                            RNFS.readFile(RNFS.DownloadDirectoryPath + '/' + item.value, 'utf8')
                            .then((contents) => {
                                setItems(JSON.parse(contents));
                            });
                            setValue(item.value);
                        }}/>
                </View>
                <View style={styles.option}>
                    <Text style={styles.settingText}>
                        Total Score: {items.reduce((n: number, {score}: any) => n + score, 0)}
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
            </ScrollView>
            : <View style={styles.screen}>
                <View style={{paddingTop: '50%'}}>
                    <Text style={{
                        textAlign: 'center',
                        color: 'black',
                        fontSize: 40,
                        }}>
                        No saved scores found!
                        {'\n\n'}
                        Play a game from start to finish first :)
                    </Text>
                </View>
            </View>}
        </SafeAreaView>
    );
};

export default ScoreScreen;
