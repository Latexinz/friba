import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { usePreventRemove } from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';

import { styles } from "../assets/styles";


function ScoreScreen({navigation}) {

    const [lastGame, setLastGame] = React.useState('');

    RNFS.readDir(RNFS.DownloadDirectoryPath)
    .then((result) => {
        //console.log('GOT RESULT', result);
        let names = [];
        for (const data of result) {
            names.push(data.name);
        }
        return RNFS.readFile(RNFS.DownloadDirectoryPath + '/' + JSON.stringify(names[names.length-1]).replaceAll('"', ''), 'utf8');
    })
    .then((contents) => {
        setLastGame(contents);
    });

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
            </View>
        </SafeAreaView>
    );
};

export default ScoreScreen;
