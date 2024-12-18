import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
  Vibration,
} from "react-native";
import { 
  Divider, 
  DataTable, 
  Button 
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { styles, colors } from "../assets/styles";
import * as courseData from '../assets/radat.json';

function SetupScreen({navigation}) {

  const [value, setValue] = React.useState("turku"); //Default location

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [items, setItems] = React.useState(courseData[value]);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const [course, setCourse] = React.useState(null);
  const [params, setParams] = React.useState([{}]);
  const [ready, setReady] = React.useState(true);

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
            inputSearchStyle={styles.settingText}
            searchPlaceholder='search...'
            data={courseData.locations}
            //autoScroll={false}
            search
            labelField='label'
            valueField='value'
            value={value}
            onChange={item => {
              setValue(item.value);
              setItems(courseData[item.value]);
            }}/>
        </View>
        <Divider bold/>
        <View style={styles.option}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Course</DataTable.Title>
              <DataTable.Title numeric>Length</DataTable.Title>
              <DataTable.Title numeric>Par</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
              <DataTable.Row 
              key={item.key}
              onPress={() => {
                Vibration.vibrate(50);
                setCourse(item);
                let newParams = [];
                for (let i = 0; i < parseInt(item.length); i++) {
                  let newItem = {
                      "key": String(i+1),
                      "score": 0
                   };
                   newParams.push(newItem);
                };
                setParams(newParams);
                setReady(false);
              }}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>{item.length}</DataTable.Cell>
                <DataTable.Cell numeric>{item.par}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(items.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${items.length}`}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </View>
        <Divider bold/>
        <View style={styles.option}>
          <Text style={styles.settingText}>
            {course === null ? '' : JSON.stringify(course.name).replaceAll('"', '')}
          </Text>
        </View>
        <View style={
        {
          paddingHorizontal:'25%',
        }}>
          <Button
            mode='contained'
            buttonColor={colors.fribaGreen}
            disabled={ready}
            onPress={() => {
              Vibration.vibrate(50);
              navigation.navigate('GameScreen', {params});
            }}>
              Start Game
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupScreen;
