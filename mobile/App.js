import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Dimensions, ActivityIndicator, AsyncStorage } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, connect } from 'react-redux';



import RootScreen from './screens/RootScreen';

import Colors from './constants/Colors';

import store from './store';

import {cache, pubsub, _} from 'helper';
import {Provider as AntdProvider} from '@ant-design/react-native';


import './boot';

const Stack = createStackNavigator();

const renderLaoding = (p)=>{
  const w = Dimensions.get('window');
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      position: 'absolute',
      width: w.width,
      height: w.height,
      left: 0,
      top: 0
    }}>
      <View style={{
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: "rgba(0,0,0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <ActivityIndicator size="large" color={'#fff'} />
      </View>
    </View>
    
  );
}

const RootApp = (props)=>{
  const [isLoadingComplete, setLoadingComplete] = React.useState(true);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  // const { getInitialState } = useLinking(containerRef);

  const [globalLoading, setGlobalLoading] = React.useState(false);
  
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    async function loadResourcesAndDataAsync() {
      try {
        

        

        // init pubsub
        pubsub.subscribe('app-loading', (f)=>{
          setGlobalLoading(f);   
        });
        


      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();

  }, []);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AntdProvider>
      <View style={{flex: 1}}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator headerMode="none">
            
              <Stack.Screen name="Root" component={RootScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        {globalLoading && renderLaoding()}
      </View>
      </AntdProvider>
    );
  }
}

const mapStateToProps = (state)=>{
  return state;
};
const ConnectedRootContainer = connect(mapStateToProps)(RootApp);
export default function App(){
  return (
    <Provider store={store}>
      <ConnectedRootContainer />
    </Provider>
  );
}



