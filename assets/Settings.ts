import React from "react";
import {Vibration} from "react-native";


export function HapticFeedback() {

    return(
        Vibration.vibrate(20)
    );
};

export const ThemeContext = React.createContext('Light');
