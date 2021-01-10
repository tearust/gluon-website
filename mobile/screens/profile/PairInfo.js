import React from 'react';
import {Button, Image, Icon, Avatar, Card, Divider} from 'react-native-elements';
import {Base, _, UI, createContainer} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, List} from '@ant-design/react-native';


import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';

import userAction from '../../store/action/user';


export default createContainer(class extends Base {

  renderMain(p, s){
    const sy = {
      text: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
      }
    }

    const {pair_info} = this.props;
    return (
      <ScrollPageView 
        header={this.renderHeader()} 
        style={{paddingTop: 0, backgroundColor:'#fff'}}
        contentStyle={{paddingLeft: 0, paddingRight: 0}}
      >
        
        {pair_info && this.renderPairInfo(pair_info)}
        {!pair_info && this.renderNoPairInfo()}
      </ScrollPageView>
    );
  }

  renderPairInfo(info){
    return null;
  }

  renderNoPairInfo(){
    const {json} = this.props;
    let address = '';
    let nonce = '';

    let canPair = false;
    if(json && json.type === 'pair'){
      address = json.address;
      nonce = json.nonce;
      
      canPair = true;
    }
    
    return (
      <List renderHeader={'Request Info'}>
        <List.Item extra={address} arrow="empty">
          Pair Address
        </List.Item>
        <List.Item extra={nonce}>
          Nonce
        </List.Item>

        <Button 
          onPress={()=>{this._goPath('scan_qr_code_modal')}}
          title="SCAN QR CODE" 
          type="outline"
          containerStyle={{
            marginTop: 50,
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 50,
          }} 
        />

        {
          canPair &&
          (
            <Button 
              onPress={this.pairHandler.bind(this, json)}
              title="PAIR DEVICE" 
              containerStyle={{
                marginTop: -30,
                marginLeft: 40,
                marginRight: 40,
                marginBottom: 50,
              }} 
            />
          )
        }
      </List>
    );
  }

  renderHeader(){
    return (
      <Header 
        title="PAIR INFO"
      />
    )
  }

  async pairHandler(json){
    UI.log(json);
    const layer1 = await Layer1.get();
    
    UI.loading(true);
    try{
      const ac = await layer1.getCurrentAccount();
      
      await layer1.gluon.responePairWithNonce(json.nonce, ac, json.address);
      
      UI.success('Pair Success');

    }catch(e){
      const err = e.toString();
      UI.error(err);
    }

    UI.loading(false);
  }

  async componentDidMount(){
    UI.loading(true);

    
    UI.loading(false);
  }

  
  
}, (state)=>{
  const {user} = state;
  return {
    layer1_account: user.layer1_account,
    pair_info: user.pair_info,
    json: user.qrcode,
  }
}, (dispatch, props)=>{
  
  return {
    setPairInfo(info){
      dispatch(userAction.setPairInfo(info));
    }
  };
})
