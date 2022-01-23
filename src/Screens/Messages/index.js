import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import useAppTheme from '../../Themes/Context';
import {useStoreState} from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from '../../Components/ActionButton';
import FooterScreen from '../../Components/FooterScreen';
import {Container} from '../../Components';
import Routes from '../../Navigation/Routes';
import theme from '../../Themes/configs/default';
import NotifyItem from '../../Components/NotifyItem';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../Config';

const Messages = ({route, navigation}) => {
  const {theme} = useAppTheme();
  const [user, setUser] = useState({});
  const [serverData, setServerData] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  useEffect( async () => {
    let isMounted = true;    
    if(isMounted) {
      var userInfo = JSON.parse(await AsyncStorage.getItem('USER_INFO'));
      setUser(userInfo);
    }
    
    await axios.post(`${BASE_URL}/notify/getList`, {user_id: userInfo.id}).then( res => {
      if(isMounted) {
        if(res.data.success) {
          setServerData(res.data.data);
          if(res.data.data.length > 0) {
            setViewMode(true);
          }
        }
      }
    }).catch(err => {
    });
    return () => { isMounted = false };
  }, []);
  
  const renderView = () => {
    if(viewMode) {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <View style={[styles.card, styles.shadowProp]}>
                {serverData.map(data => {
                  return <NotifyItem key={data.id} data={data} navigation={navigation}></NotifyItem>
                })}
              </View>
        </View>
      )
    }else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <Text>There are no messages</Text>
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
              {renderView()}
            </View>
          </ScrollView>
          <FooterScreen tabIndex={4}/>
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

export default Messages;
