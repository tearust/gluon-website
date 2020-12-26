import {Header} from 'react-native-elements';
import React from 'react';
import Styles from '../constants/Styles';
import UI from '../helper/UI';

export default (props)=>{
  const p = {
    centerComponent: {
      text: props.title || '',
      style: Styles.header_title,
    },
    backgroundImage: require('../assets/images/nav_bg.png'),
    leftComponent: UI.getHeaderBackElement(()=>{
      UI.goBack();
    }),
  };
  return (
    <Header {...p} {...props} />
  );
}