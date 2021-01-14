import React from 'react';
import {Image, Icon} from 'react-native-elements';
import {Base, _, UI, Btc, cache, pubsub, createContainer} from 'helper';
import {FixedPageView} from '../../components/Page';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card, Modal, Button, Flex, List, InputItem} from '@ant-design/react-native';
import Layer1 from '../../layer1';

import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';


const mem = cache.mem;
export default class extends Base {

  _defineState(){
    this.mode = null;
    this.cb = null;
    return {
      visible: false,
      pwd1: '',
      pwd2: '',
      error: null,
    }
  }

  _init(){

  }

  renderMain(p, s){

    const sy = {
      
    };

    let title = 'Setting Password';
    if(this.mode === 'verify'){
      title = 'Verify Password'
    }
    return (
      <Modal
        popup={false}
        transparent
        visible={this.state.visible}
        animationType="slide-up"
        onClose={this.close.bind(this, false)}
      >
        <View style={{ 
          paddingVertical: 0, 
          paddingHorizontal: 0, 
          // height: 400,
        }}>
          <Text style={{ textAlign: 'center', fontSize: 18 }}>{title}</Text>
          
          <View style={{marginTop: 32, borderWidth:0,}}>
            <InputItem type="password" value={this.state.pwd1} onChange={this.valueChange.bind(this, 'pwd1')} placeholder="Password"></InputItem>

            {
              this.mode !== 'verify' && 
              <InputItem type="password" value={this.state.pwd2} onChange={this.valueChange.bind(this, 'pwd2')} placeholder="Verify Password"></InputItem>
            }
            
            {this.state.error && <Text style={{textAlign:'right', color:'red'}}>{this.state.error}</Text>}
          </View>

        </View>

        <Flex direction="row" style={{marginTop: 30}}>
          <Flex.Item style={{paddingRight: 10,}}>
            <Button size="small" {...Styles.cancel_button} onPress={this.close.bind(this, false)}>
              CANCEL
            </Button>
          </Flex.Item>
          
          <Flex.Item style={{paddingLeft: 10,}}>
            <Button size="small" styles={{
              text: {
                color: 'red'
              }
            }} {...Styles.confirm_button} onPress={this.confirm.bind(this)}>
              CONFIRM
            </Button>
          </Flex.Item>
          
        </Flex>
      </Modal>
       
    );
  }

  valueChange(key, val){
    this.setState({
      [key]: val
    });
  }


  close(call_cb=false){
    // this.mode = null;

    this.setState({
      visible: false, 
      error: null,
      pwd1: '',
      pwd2: '',
    });
    if(call_cb){
      this.cb(this.state.pwd1);
    }
    else{
      this.cb(null);
    }
  }

  validate(){
    const {pwd1, pwd2} = this.state;
    if(!pwd1 || pwd1.length < 6){
      return 'password length must more than 6.';
    }

    if(this.mode === 'set'){
      if(pwd1 !== pwd2){
        return 'Twice password is not same.'
      }
    }

    return false;
  }

  confirm(){
    const error = this.validate();
    if(error){
      this.setState({
        error
      });
      return false;
    }
    
    this.close(true);
  }

  open(mode, cb=()=>{}){
    this.mode = mode;
    this.cb = cb;

    this.setState({
      visible: true
    });
  }
  
}
