import React from "react";
import {
    Vibration
} from "react-native";

const [haptics, setHaptics] = React.useState(true);

export function HapticFeedback() {

    return(
        haptics ? Vibration.vibrate(20) : null
    );
};
