import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc, pubsub, crypto} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card, Modal} from '@ant-design/react-native';
import Layer1 from '../../layer1';

import TouchID from 'react-native-touch-id';

import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';

import store from '../../store';
import userTypes from '../../store/type/user';
import userAction from '../../store/action/user';


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
            <Button containerStyle={{marginTop: 10,}} title={'Verify'} onPress={this.btc_verify.bind(this)} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="NATIVE" />
          <Card.Body>
          <Button title={'NATIVE TOUCH ID'} onPress={this.nativeTouchId.bind(this)} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="CRYPTO" />
          <Card.Body>
            <Button title={'AES'} onPress={this.aesHandler.bind(this)} />
            <Button title={'DES'} onPress={this.desHandler.bind(this)} />
            
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="UTILITY" />
          <Card.Body>
            <Button title={'SCAN QRCODE'} onPress={this.openScanQrcodeModal.bind(this)} />
            <Button title={'Set Password Modal'} onPress={this.openPrivatePasswordModal.bind(this, 'set')} />
            <Button title={'Verify Password Modal'} onPress={this.openPrivatePasswordModal.bind(this, 'verify')} />
            
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="USER" />
          <Card.Body>
            <Button title={'REMOVE PASSWORD'} onPress={this.removePassword.bind(this)} />
            <Button title={'VERIFY PASSWORD'} onPress={this.verifyPassword.bind(this)} />
            
            
          </Card.Body>
        </Card>

    <Text>{this.state.text}</Text>

    
        
      </ScrollPageView>
    );
  }

  removePassword(){
    store.dispatch({
      type: userTypes.set_encrypted_password,
      param: null,
    })
  }

  nativeTouchId(){
    TouchID.authenticate('to demo this react-native component', {
      passcodeFallback: true,
      
    })
    .then((success) => {
      UI.log(success);
    })
    .catch(error => {
      console.error(error);
      UI.log(error);
    });

  }

  async verifyPassword(){
    try{
      const rs = await store.dispatch(userAction.verifyPassword());
      alert(rs);
    }catch(e){

    }
  }

  aesHandler(){
    const password = 'jacky.li';
    const data = 'hello world';

    const aes_rs = crypto.aes(password, data);
    this.setState({text: aes_rs});
  }

  desHandler(){
    const password = 'jacky.li';
    const des_rs = crypto.des(password, this.state.text);
    UI.log(des_rs);
  }

  openScanQrcodeModal(){
    this._goPath('scan_qr_code_modal')
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

  async openPrivatePasswordModal(mode){
    try{
      const pwd = await UI.showPrivatePasswordModal(mode);
      alert(pwd);
    }catch(e){

    }
    
  }

  async componentDidMount(){
    
    UI.loading(true);
    this.btc = new Btc('a');
    await this.btc.init();

    // await Layer1.get();
    UI.loading(false);
  }
  
}
