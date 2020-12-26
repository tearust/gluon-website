import * as React from 'react';
import { Text } from 'react-native';

export const MonoText = (props)=>{
  return <Text {...props} style={[props.style, { 
    // fontFamily: 'space-mono' 
  }]} />;
}
