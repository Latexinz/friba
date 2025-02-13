import { StyleSheet } from "react-native";
import { DefaultTheme } from '@react-navigation/native';


export const themes = {
    light: {
        dark: false,
        colors: {
            primary: 'rgb(68, 158, 72)',
            background: 'rgb(242, 242, 242)',
            card: 'rgb(255, 255, 255)',
            text: 'rgb(28, 28, 30)',
            border: 'rgb(199, 199, 204)',
            notification: 'rgb(255, 69, 58)',
        },
        fonts: DefaultTheme.fonts,
    },
    dark: {
        dark: true,
        colors: {
            primary: 'rgb(100, 149, 237)',
            background: 'rgb(28, 28, 30)',
            card: 'rgb(50, 50, 50)',
            text: 'rgb(242, 242, 242)',
            border: 'rgb(199, 199, 204)',
            notification: 'rgb(255, 69, 58)',
        },
        fonts: DefaultTheme.fonts,
    }
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent:'center',
    },
    screen: {
        paddingHorizontal:'5%',
        paddingVertical:'5%',
    },
    option: {
        flexDirection:'row',
        paddingTop:'3%',
        justifyContent:'space-between',
        alignItems:'center',
    },
    description: {
        flexDirection:'row',
        paddingBottom:'3%',
        justifyContent:'space-between',
        alignItems:'center',
    },
    checkbox: {
        flexDirection:'row',
        paddingTop:'3%',
        justifyContent:'space-between',
        alignItems:'center',
    },
});

export const appColors = {
    fribaGreen: '#449e48',
    fribaGrey: '#8c9096',
    fribaRed: '#d2042d',
    fribaBlue: '#6495ed'
};
