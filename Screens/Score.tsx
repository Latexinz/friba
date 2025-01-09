import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { usePreventRemove } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { DataTable } from 'react-native-paper';

import { styles } from "../assets/styles";


function ScoreScreen({navigation}) {

    const [items, setItems] = React.useState([]);
    const [lastGame, setLastGame] = React.useState('');
    const [allGames, setAllGames] = React.useState(['']);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            RNFS.readDir(RNFS.DownloadDirectoryPath)
            .then((result) => {
                let names = [];
                for (const data of result) {
                    names.push(data.name);
                }
                setAllGames(names);
                setLastGame(
                    JSON.stringify(names[names.length-1])
                    .replaceAll('"', '')
                    .replace('.txt', '')
                    .replaceAll('_', ' ')
                );
                return RNFS.readFile(RNFS.DownloadDirectoryPath + '/' + JSON.stringify(names[names.length-1]).replaceAll('"', ''), 'utf8');
            })
            .then((contents) => {
                setItems(JSON.parse(contents));
            });
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
            <View style={styles.screen}>
                <View style={styles.option}>
                    <Text style={styles.settingText}>
                        {lastGame}
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
        </SafeAreaView>
    );
};

export default ScoreScreen;
