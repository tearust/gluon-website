import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc,} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card} from '@ant-design/react-native';
import Layer1 from '../../layer1';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';


export default class extends Base {
  _defineState(){
    return {
      text: 'aa',
    };
  }
  _init(){
    this.btc = null;

    this.data = {};
  }

  renderMain(p, s){

    return (
      <ScrollPageView header={this.renderHeader()} style={{paddingTop: 10}}>
        <Card>
          <Card.Header title="SPEC256K1" />
          <Card.Body>
            <Button title={'Sign'} onPress={this.btc_sign.bind(this)} />
            <Button containerStyle={{marginTop: 30,}} title={'Verify'} onPress={this.btc_verify.bind(this)} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="LAYER1" />
          <Card.Body>
            <Button title={'PAIR WITH NONCE'} onPress={this.pairWithNonce.bind(this)} />
            
          </Card.Body>
        </Card>

    <Text>{this.state.text}</Text>

    <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
        
      </ScrollPageView>
    );
  }

  onSuccess(e){
    console.log(1, e);
  }

  btc_sign(){
    const msg = 'hello world';
    const sig = this.btc.sign(msg);

    this.data.sig = sig;
    this.setState({
      text: `Sig = ${sig}`
    });
  }

  btc_verify(){
    const msg = 'hello world';

    const rs = this.btc.verify(this.data.sig, msg);

    UI.log(rs);
  }

  renderHeader(){
    return (
      <Header 
        title="Test"
        leftComponent={null}
        rightComponent={
          <View style={{flex:1, flexDirection:'row', width:60, top: 10, right: 15, justifyContent:'space-between'}}>
            
          </View>
        }
      />
    )
  }

  async pairWithNonce(){
    const layer1 = await Layer1.get();

    const nonce = '10000'; //layer1.gluon.getRandomNonce();
    console.log(nonce);
    
    try{
      const ac = await layer1.getCurrentAccount();
      console.log(ac);
      await layer1.gluon.responePairWithNonce(nonce, ac, '5FnjDG3j9uVCXuyCd2UgzwHUyT7CpgbR6HquvPdas4ttvErM');
      UI.alert('success')
    }catch(e){
      const err = e.toString();
      UI.error(err);
    }
  }

  async componentDidMount(){
    UI.loading(true);
    this.btc = new Btc('a');
    await this.btc.init();

    await Layer1.get();
    UI.loading(false);
  }
  
}
