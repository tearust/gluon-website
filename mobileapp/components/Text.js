import {Text} from 'react-native-elements';
import React from 'react';
import Styles from '../constants/Styles';

export default (props)=>{
  const sy = {
    ...Styles.ikea
  };
  return (
    <Text style={sy} {...props} />
  );
}