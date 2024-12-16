import React, { useState } from "react";
import { 
  View,
  SafeAreaView,
  Text,
} from "react-native";
import { Divider, DataTable } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from "../assets/styles";
import * as courseData from '../assets/radat.json';

function NewGameScreen({navigation}) {

  const [value, setValue] = useState("turku");

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
              setItems(courseData[value]);
            }}/>
        </View>
        <Divider bold/>
        <View style={styles.option}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Course</DataTable.Title>
              <DataTable.Title>Length</DataTable.Title>
              <DataTable.Title>Par</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
              <DataTable.Row key={item.key}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>{item.length}</DataTable.Cell>
                <DataTable.Cell>{item.par}</DataTable.Cell>
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
      </View>
    </SafeAreaView>
  );
};

export default NewGameScreen;
