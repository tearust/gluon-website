import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc, cache, pubsub, createContainer} from 'helper';
import {FixedPageView} from '../../components/Page';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card} from '@ant-design/react-native';
import Layer1 from '../../layer1';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';

import userAction from '../../store/action/user';

const mem = cache.mem;
export default createContainer(class extends Base {

  _init(){
    this.btc = null;

    this.data = {};
  }

  renderMain(p, s){

    const styles = {
      textBold: {
        fontWeight: '500',
        color: '#fff'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      },
      cameraStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      containerStyle: {
        
      }
    };

    return (
      <FixedPageView header={this.renderHeader()} contentStyle={{paddingLeft:0, paddingRight:0,}}>
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          flashMode={RNCamera.Constants.FlashMode.off}
          cameraStyle={styles.cameraStyle}
          containerStyle={styles.containerStyle}
          showMarker={true}
          fadeIn={false}
          topContent={
            null
          }
          cameraProps={{

          }}
          bottomContent={
            <Button type="outline" title="OK" />
          }
        />  
      </FixedPageView>
       
    );
  }

  onSuccess(e){
    try{
      const text = e.data;
      const json = JSON.parse(text);
      this.props.set(json);
    }catch(e){
      
      _.delay(()=>{
        UI.error('Invalid QR Code');
      }, 200)
    }
    this.onClose();
    
  }


  renderHeader(){
    return (
      <Header 
        title="SCAN QR CODE"
        leftComponent={null}
        
        rightComponent={
          <TouchableOpacity onPress={this.onClose.bind(this)}>
            <Icon type="ionicon" name="close-circle-outline" color="#fff" size={28} />
          </TouchableOpacity>   
        }
      />
    )
  }

  onClose(){

    this._goBack();
  }
  
}, (state)=>{
  return {};
}, (dispatch)=>{
  return {
    set(json){
      dispatch(userAction.setQrcode(json));
    }
  };
})
