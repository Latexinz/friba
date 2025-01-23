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
        color:'#8c9096',
        fontSize: 24,
        paddingTop: '2%'
    },
    settingText: {
        color:'black',
        fontSize: 18
    },
    descriptionText: {
        color:'black',
        fontSize: 12
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
    dropdown: {
        height: 50,
        width: '75%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    dropdownS: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
});

export const colors = {
    fribaGreen: '#449e48',
    fribaGrey: '#8c9096',
    fribaRed: '#d2042d'
}
