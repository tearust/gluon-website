import React from 'react';
import {Button, Image, Icon, Avatar, Card, Divider} from 'react-native-elements';
import {Base, _, UI} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress} from '@ant-design/react-native';


import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';


export default class extends Base {
  _defineState(){
    return {
      layer1_account: null
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
    
    return (
      <ScrollPageView 
        header={this.renderHeader()} 
        style={{paddingTop: 10}}
      >
        {this.state.layer1_account && (
          <Card containerStyle={{margin:0,}}>
            <Card.Title>ACCOUNT DETAILS</Card.Title>
            <Card.Divider/>
            <Text style={sy.text}>ADDRESS: {this.state.layer1_account.address}</Text>
            <Divider />
            <Text style={sy.text}>{this.state.layer1_account.mnemonic}</Text>
          </Card>
        )}
        
        <Button onPress={this.signHandler.bind(this)} type="solid" title="SIGN" containerStyle={{marginTop: 30}} />
        

      </ScrollPageView>
    );
  }
  signHandler(){
    if(this.state.layer1_account){
      // const rs = this.state.layer1_account.sign("aaa");
      // console.log(11, rs);

      // const x = this.state.layer1_account.verify('aaa', rs);
      // UI.log(x);
    }
  }

  renderHeader(){
    return (
      <Header 
        title="LAYER1 ACCOUNT"
      />
    )
  }

  async componentDidMount(){
    UI.loading(true);

    const layer1 = await Layer1.get();
    const ac = await layer1.getCurrentAccount();
    this.setState({
      layer1_account: ac
    });

    console.log(ac)
    UI.loading(false);
  }

  
  
}
