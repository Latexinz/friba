import React from "react";
import { 
  View,
  SafeAreaView,
  Text,
  Linking,
  Pressable
} from "react-native";
import { 
  Divider, 
  DataTable, 
  Button,
  Checkbox,
  Portal,
  Modal,
  Icon
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { HapticFeedback } from "../assets/Settings";
import { styles, colors } from "../assets/Styles";
import * as courseData from '../assets/radat.json';


function SetupScreen({navigation}: any) {

  const [value, setValue] = React.useState("turku"); //Default location

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([12]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [items, setItems] = React.useState(courseData[value]);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const [visible, setVisible] = React.useState(false);
  const [courseInfo, setCourseInfo] = React.useState(
    {
      "coordinates": [
        {
          "lat": "", "lon": ""
        }
      ], 
      "par": "", 
      "length": ""
    }
  );

  const [params, setParams] = React.useState([{}]);
  const [ready, setReady] = React.useState(true);

  const [max, setMax] = React.useState(false);
  const [time, setTime] = React.useState('');
  const [name, setName] = React.useState('');
  const [par, setPar] = React.useState('');

  return (
    <Portal.Host>
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
                setPage(0);
              }}/>
          </View>
          <View style={styles.option}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Course</DataTable.Title>
                <DataTable.Title numeric>Holes</DataTable.Title>
              </DataTable.Header>

              {items.slice(from, to).map((item: any) => (
                <DataTable.Row 
                key={item.key}
                onPress={() => {
                  HapticFeedback();
                  setCourseInfo({
                    "coordinates": item.coordinates,
                    "par": item.par,
                    "length": item.length
                  });
                  let newParams = [];
                  for (let i = 0; i < parseInt(item.length); i++) {
                    let newItem = {
                        "hole": item.holes[i].hole,
                        "distance": item.holes[i].distance,
                        "par": item.holes[i].par,
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
                  );
                  setPar(
                    JSON.stringify(item.par)
                    .replaceAll('"', '')
                  );
                  setReady(false);
                  setVisible(true);
                }}>
                  <DataTable.Cell>{item.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.length}</DataTable.Cell>
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
    
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              contentContainerStyle={{
                alignSelf:'center',
                backgroundColor:'white',
                padding:'5%',
                width:'90%',
              }}>
              <View style={styles.option}>
                <Text style={{color:colors.fribaGrey, fontSize: 22,}}>
                  {name === undefined ? 'No course set' : name}
                </Text>
                <Pressable 
                  onPress={() => {
                    HapticFeedback();
                    Linking.openURL('http://maps.google.com/?q='+ courseInfo.coordinates[0].lat +','+ courseInfo.coordinates[0].lon);
                  }}>
                    <Icon 
                    source='map'
                    color={colors.fribaBlue}
                    size={28}/>
                </Pressable>
              </View>
              <Divider bold/> 
              <View style={styles.option}>
                <Text style={styles.settingText}>
                  Holes: {courseInfo === undefined ? 'N/A' : JSON.stringify(courseInfo.length).replaceAll('"', '')}
                  {'\n'}
                  Par: {courseInfo === undefined ? 'N/A' : JSON.stringify(courseInfo.par).replaceAll('"', '')}
                </Text>
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
              <View style={{paddingHorizontal:'25%', paddingTop:'5%'}}>
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
            </Modal>
          </Portal>
        </View>
      </SafeAreaView>
    </Portal.Host>
  );
};

export default SetupScreen;
