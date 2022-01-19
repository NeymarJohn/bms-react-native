import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import useAppTheme from '../../Themes/Context';
import { ScrollView } from 'react-native-gesture-handler';
import {Container} from '../../Components';
import theme from '../../Themes/configs/default';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import { useIsFocused } from '@react-navigation/native';
import Routes from '../../Navigation/Routes';
import { useNavigation } from '@react-navigation/native';

const ManageOwners = ({route, navigation}) => {
  const {theme} = useAppTheme();
  const [user, setUser] = useState({});
  const { data } = route.params;
  const [serverData, setServerData] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const isFocused = useIsFocused();
  const navigate = useNavigation();
  useEffect( async () => {
    var userInfo = JSON.parse(await AsyncStorage.getItem('USER_INFO'));
    setUser(userInfo);
    await axios.post(`${BASE_URL}/unit/getList`, {building_id: data.id}).then( res => {
      if(res.data.success) {
        setServerData(res.data.data);
        setTotalCount(res.data.data.length);
        if(res.data.data.length > 0) {
          setViewMode(true);
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }, [isFocused]);

  const submitHandle = () => {
    navigate.navigate(Routes.ASSOCIATION_ADD_UNITS, {data: data});
  }
  
  const renderView = () => {
    if(viewMode) {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
              <View style={[styles.card, styles.shadowProp]}>
                {serverData.map(data => {
                  return (
                    <View key={data.id}
                    style={{borderRadius: 3, backgroundColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomColor: '#e2e2e2', borderBottomWidth: 0.8, marginTop: 5}}>
                        <View style={{flexDirection: 'column', justifyContent: "space-between", alignItems: 'flex-start', alignContent: 'center'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between'}}>
                                <View><Text>{data.unit_name}</Text></View>
                            </View>
                        </View>
                    </View>
                  )
                })}
              </View>
        </View>
      )
    }else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <Text>There are no units</Text>
        </View>
      )
    }
  }
  return (
      <LoadingActionContainer fixed>
        <Container
          style={{
            backgroundColor: theme.colors.primary,
            flex: 1,
          }}>
          <ScrollView>
            <View style={{paddingBottom: 100}}>
              <View style={{flexDirection: 'column', padding: 20, }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1}}>
                    <Text style={{top: 10}}>Total {totalCount}</Text>
                    <Button
                      mode="contained"
                      style={{borderRadius: 5, padding: 5}}
                      color={theme.colors.background}
                      onPress={submitHandle}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          color: theme.colors.primary
                        }}>
                        ADD
                      </Text>
                    </Button>
                  </View>
              </View>
              {renderView()}
            </View>
          </ScrollView>
        </Container>
      </LoadingActionContainer>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: 5, height: -5},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  card: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
});

export default ManageOwners;
