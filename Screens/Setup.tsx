import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { 
  Divider, 
  DataTable, 
  Button,
  Checkbox 
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { HapticFeedback } from "../assets/Settings";
import { styles, colors } from "../assets/Styles";
import * as courseData from '../assets/radat.json';


function SetupScreen({navigation}) {

  const [value, setValue] = React.useState("turku"); //Default location

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([6]);
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

  const [max, setMax] = React.useState(false);
  const [time, setTime] = React.useState('');
  const [name, setName] = React.useState('');
  const [par, setPar] = React.useState('');

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

            {items.slice(from, to).map((item: any) => (
              <DataTable.Row 
              key={item.key}
              onPress={() => {
                HapticFeedback();
                setCourse(item);
                let newParams = [];
                for (let i = 0; i < parseInt(item.length); i++) {
                  let newItem = {
                      "hole": String(i+1),
                      "score": 0
                   };
                   newParams.push(newItem);
                };
                setParams(newParams);
                setTime(
                  new Date()
                  .toLocaleString()
                  .replaceAll('/', '-')
                  .replace(', ', '_')
                  .replaceAll(':', '-')
                );
                setName(
                  JSON.stringify(item.name)
                  .replaceAll('"', '')
                  .replaceAll(' ', '_')
                );
                setPar(
                  JSON.stringify(item.par)
                  .replaceAll('"', '')
                );
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
        <View style={styles.checkbox}>
          <Text style={styles.settingText}>
            (Optional) 10 throws max
          </Text>
          <Checkbox
            status={max ? 'checked' : 'unchecked'}
            color={colors.fribaGreen}
            onPress={() => {
              HapticFeedback();
              setMax(!max);
          }}/>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Limit number of throws per hole to 10
          </Text>
        </View>
        <Divider bold/>
        <View style={styles.option}>
          <Text style={styles.settingText}>
            {course === null ? 'No course set' : JSON.stringify(course.name).replaceAll('"', '')}
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
              HapticFeedback();
              navigation.navigate('GameScreen', {params, max, time, name, par});
            }}>
              Start Game
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetupScreen;
