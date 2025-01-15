import React from "react";
import {SafeAreaView, View} from "react-native";
import {ActivityIndicator} from 'react-native-paper';
import {styles, colors} from "./Styles";

export function LoadingScreen() {

    return(
        <SafeAreaView style={styles.container}>
            <View style={{paddingVertical:'100%'}}>
                <ActivityIndicator size={70} color={colors.fribaGreen}/>
            </View>
        </SafeAreaView>
    );
};
