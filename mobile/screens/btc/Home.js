import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress} from '@ant-design/react-native';


import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';


export default class extends Base {
  _defineState(){
    return {
      nodes: null,
    };
  }
  _defineStyle(){
    return {
      
    }
  }
  _init(){
    
  }
  renderMain(p, s){

    return (
      <ScrollPageView header={this.renderHeader()} style={{paddingTop: 10}}>
        <Button onPress={this.createAccountHandler.bind(this)} type="solid" title="Create Account" containerStyle={{marginTop: 30}} />
        <Button onPress={this.scanQrCodeHandler.bind(this)} type="solid" title="Scan QR Code" containerStyle={{marginTop: 30}} />
        {/* <Button onPress={} type="outline" title="Create Account" containerStyle={{marginTop: 30}} /> */}

        <Text>{this.state.nodes && JSON.stringify(this.state.nodes)}</Text>
      </ScrollPageView>
    );
  }

  renderHeader(){
    return (
      <Header 
        title="BTC Home"
        leftComponent={null}
        rightComponent={
          <View style={{flex:1, flexDirection:'row', width:60, top: 10, right: 15, justifyContent:'space-between'}}>
            
          </View>
        }
      />
    )
  }

  async createAccountHandler(){
    const layer1 = await Layer1.get();
    const mn = layer1.mnemonicGenerate();
    const ac = layer1.generateNewAccount(mn);

    UI.log(ac)
  }

  async scanQrCodeHandler(){
    const layer1 = await Layer1.get();
    const nodes = await layer1.getBootstrapNodes();
    // alert(JSON.stringify(nodes));
    this.setState({
      nodes: nodes
    });
  }

  async componentDidMount(){
    UI.loading(true);

    await Layer1.get();

    UI.loading(false);
  }
  
}
