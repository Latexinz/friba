import { 
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent:'center',
    },
    categoryText: {
    color:'gray',
        fontSize: 24
    },
    settingText: {
        color:'black',
        fontSize: 18
    },
    switch: {
        flexDirection:'row',
        paddingVertical:'3%',
        justifyContent:'space-between'
    }
});

export const colors = {
    fribaGreen: '#449e48',
}