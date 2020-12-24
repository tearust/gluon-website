import React from 'react';
import {View} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { _, pubsub } from 'helper';
import Router from '../constants/Router';

const Modal = createStackNavigator();
const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const BottomTabScreen = ({navigation})=>{
  //Don't setOptions, which will cause 'Warning: Cannot update a component from inside the function body of a different component.'
  //navigation.setOptions({
  //  headerShown: false
  //});

  const [tab, setTab] = React.useState(Router.init_tab);

  React.useEffect(()=>{
    pubsub.subscribe('app-set-tab', (name)=>{
      setTab(name);
    });
  }, []);
  return (
    <BottomTab.Navigator initialRouteName={tab}>
      {
        _.map(Router.tab, (item, i)=>{
          return (
            <BottomTab.Screen {...item} key={i} />
          );
        })
      }
    </BottomTab.Navigator>
  );

};

const MainStackScreen = ()=>{
  return (
    <Stack.Navigator>
      <Stack.Screen name="tab" component={BottomTabScreen} options={{headerShown: false}} />
      {
        _.map(Router.stack, (item, i)=>{
          return (
            <Stack.Screen {...item} key={i} options={{headerShown: false}} />
          );
        })
      }
    </Stack.Navigator>
  );
};

export default (props)=>{
  React.useEffect(()=>{

  }, []);

  React.useEffect(()=>{
    pubsub.subscribe('app-go-back', (f)=>{
      props.navigation.goBack();
    });
    pubsub.subscribe('app-go-push', (name)=>{
      props.navigation.navigate(name);
    })
  }, []);

  return (
    <Stack.Navigator mode="modal">
      <Modal.Screen name="main" component={MainStackScreen} options={{headerShown:false}} />

      {
        _.map(Router.modal, (item, i)=>{
          return (
            <Modal.Screen {...item} key={i} />
          );
        })
      }

    </Stack.Navigator>
  );
}