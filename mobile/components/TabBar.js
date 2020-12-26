import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';

export const TabBarIcon = (props)=>{
  return (
    <Icon
      name={props.name}
      size={props.size || 30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export const TabBarText = (props)=>{
  return (
    <MonoText style={{color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}}>{props.text}</MonoText>
  );
}