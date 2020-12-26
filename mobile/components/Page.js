import React from 'react';
import {_} from 'helper';
import { ScrollView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import Colors from '../constants/Colors';

const renderLaoding = (p)=>{
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      
    }}>
      <View style={{
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: "rgba(0,0,0, 0.1)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <ActivityIndicator size="large" color={Colors.tintColor} />
      </View>
    </View>
    
  );
}

export const ScrollPageView = (p)=>{
  const s = {
    view: {
      flex: 1,
      backgroundColor: Colors.mainBgColor,
    },
    s_view: {
      flex: 1,
      backgroundColor: 'transparent',
      width: Dimensions.get('window').width
    },

    contentContainer: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 40,
      backgroundColor: 'transparent'
    }
  };
  const s_view = _.extend(s.s_view, p.style||{});

  const scrollViewProps = _.omitBy({
    keyboardDismissMode: p.keyboardDismissMode || 'none',
    onScrollBeginDrag: p.onScrollBeginDrag,
    onScroll: p.onScroll,
    onScrollEndDrag: p.onScrollEndDrag,
    refreshControl: p.refreshControl,
    stickyHeaderIndices: p.stickyHeaderIndices,
    automaticallyAdjustContentInsets: p.automaticallyAdjustContentInsets || false,
    canCancelContentTouches: p.canCancelContentTouches,
    contentOffset: p.contentOffset,
    scrollEventThrottle: p.scrollEventThrottle,
    scrollsToTop: p.scrollsToTop,
    ref: p.ref
  }, (x)=>x==undefined);

  const result = (
    <View style={[s.view, p.containerStyle||{}]}>
      {!!p.header && p.header}
      {
        p.loading ? 
        renderLaoding() : 
        (
          
          <ScrollView {...scrollViewProps} style={s_view} contentContainerStyle={[s.contentContainer, p.contentStyle||{}]}>
            
              {p.children}
            
            
          </ScrollView>
        )
      }
      {!!p.footer && !p.loading && p.footer}

    </View>
  );

  if(Platform.OS === 'ios'){
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        {result}
      </KeyboardAvoidingView>
    );
  }

  return result;
}

export const FixedPageView = (p)=>{
  const s = {
    view: {
      flex: 1,
    },
    s_view: {
      flex: 1,
      backgroundColor: Colors.mainBgColor,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 40
    }
  };
  const s_view = _.extend(s.s_view, p.style||{});

  const result = (
    <View style={s.view}>
      {!!p.header && p.header}
      {
        p.loading ? 
        renderLaoding() : 
        (
          <View style={[s_view, p.contentStyle]}>
            {p.children}
          </View>
        )
      }
      {!!p.footer && p.footer}

    </View>
  );

  if(Platform.OS === 'ios'){
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        {result}
      </KeyboardAvoidingView>
    );
  }

  return result;
}

