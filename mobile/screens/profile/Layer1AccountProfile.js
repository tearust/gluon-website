import React from 'react';
import {Button, Image, Icon, Avatar, Card, Divider} from 'react-native-elements';
import {Base, _, UI, createContainer} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress} from '@ant-design/react-native';


import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';

import userAction from '../../store/action/user';


export default createContainer(class extends Base {
  _defineState(){
    return {
      
    };
  }
  _defineStyle(){
    return {
      
    }
  }
  renderMain(p, s){
    const sy = {
      text: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
      }
    }

    const {layer1_account} = this.props;
    return (
      <ScrollPageView 
        header={this.renderHeader()} 
        style={{paddingTop: 10}}
      >
        {layer1_account && (
          <Card containerStyle={{margin:0,}}>
            <Card.Title>ACCOUNT DETAILS</Card.Title>
            <Card.Divider/>
            <Text style={sy.text}>ADDRESS: {layer1_account.address}</Text>
            <Divider />
            <Text style={sy.text}>BALANCE: {layer1_account.balance}</Text>
            <Divider />
            <Text style={sy.text}>{layer1_account.mnemonic}</Text>
          </Card>
        )}
      
        
        <Button type="outline" onPress={this.recharge.bind(this)} containerStyle={{marginTop: 40}} title="RECHARGE" />
      </ScrollPageView>
    );
  }

  renderHeader(){
    return (
      <Header 
        title="LAYER1 ACCOUNT"
      />
    )
  }

  async recharge(){
    const {layer1_account} = this.props;
    const layer1 = await Layer1.get();
    
    UI.loading(true);
    await layer1.faucet(layer1_account.address);
    const ac = await layer1.getCurrentAccount();

    this.props.setLayer1Account(ac);

    UI.loading(false);
  }

  async componentDidMount(){
//     UI.loading(true);

//     const layer1 = await Layer1.get();
//     const ac = await layer1.getCurrentAccount();
// console.log(11, ac);
//     this.props.setLayer1Account(ac);
//     UI.loading(false);
  }

  
  
}, (state)=>{
  const {user} = state;
  return {
    layer1_account: user.layer1_account,
  }
}, (dispatch, props)=>{
  
  return {
    setLayer1Account(account){
      dispatch(userAction.setLayer1Account(account));
    }
  };
})
