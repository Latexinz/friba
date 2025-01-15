import {
    Vibration
} from "react-native";

export function HapticFeedback() {

    return(
        Vibration.vibrate(20)
    );
};
