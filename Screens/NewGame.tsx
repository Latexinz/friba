import React, { useState } from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { Divider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from "../assets/styles";
import * as courseData from '../assets/radat.json';

function NewGameScreen({navigation}) {

  const [value, setValue] = useState(null);

  const locations = [
    {label: 'Turku', value: 'turku'},
    {label: 'Raisio', value: 'raisio'},
    {label: 'Naantali', value: 'naantali'},
    {label: 'Lieto', value: 'lieto'},
    {label: 'Kaarina', value: 'kaarina'}
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.option}>
          <Text style={styles.settingText}>
            Location
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.settingText}
            itemTextStyle={styles.settingText}
            selectedTextStyle={styles.settingText}
            data={locations}
            //search
            labelField='label'
            valueField='value'
            value={value}
            onChange={item => {
              setValue(item.value);
            }}/>
        </View>
        <Divider bold/>
        <Text style={styles.categoryText}>
          
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NewGameScreen;
