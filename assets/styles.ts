import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent:'center',
    },
    screen: {
        paddingHorizontal:'5%',
        paddingVertical:'5%',
    },
    categoryText: {
    color:'gray',
        fontSize: 24
    },
    settingText: {
        color:'black',
        fontSize: 18
    },
    option: {
        flexDirection:'row',
        paddingVertical:'3%',
        justifyContent:'space-between',
        alignItems:'center',
    },
    dropdown: {
        height: 50,
        width: '75%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
});

export const colors = {
    fribaGreen: '#449e48',
}