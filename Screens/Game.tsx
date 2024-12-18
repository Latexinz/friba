import React from "react";
import { 
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Vibration,
  Pressable
} from "react-native";
import { DataTable, IconButton, Icon } from "react-native-paper";

import { styles } from "../assets/styles";

function GameScreen({navigation, route}) {

    const [items, setItems] = React.useState(route.params["params"]);

    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([9]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    React.useEffect(() => {
    setPage(0);
    }, [itemsPerPage]);

    const updateScore = (key, score) => {
        setItems(
          items.map((item) => {
            if (item.key === key) {
              return { ...item, score };
            } else {
              return item;
            }
          })
        );
      };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.screen}>
            <View style={styles.option}>
                <Text style={styles.settingText}>
                    Total Score: {items.reduce((n, {score}) => n + score, 0)}
                </Text>
            </View>
            <View style={styles.option}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Hole</DataTable.Title>
                        <DataTable.Title style={{justifyContent: 'center'}}>Score</DataTable.Title>
                    </DataTable.Header>

                    {items.slice(from, to).map((item) => (
                        <DataTable.Row key={item.key}>
                        <DataTable.Cell>{item.key}</DataTable.Cell>
                        <DataTable.Cell style={{justifyContent: 'center', alignItems:'center'}} textStyle={{fontSize:40}}>
                            <Pressable onPress={() => {
                                if (item.score > 0) {
                                    updateScore(item.key, item.score-1);
                                    Vibration.vibrate(50);
                                };
                            }}>
                                <Icon 
                                source='minus-circle'
                                size={30}/>
                           </Pressable>
                            {item.score}
                            <Pressable onPress={() => {
                                updateScore(item.key, item.score+1);
                                Vibration.vibrate(50);
                            }}>
                                <Icon 
                                source='plus-circle'
                                size={30}/>
                            </Pressable>
                        </DataTable.Cell>
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
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default GameScreen;
