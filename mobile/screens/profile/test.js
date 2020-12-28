import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc,} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card} from '@ant-design/react-native';


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
    <Text>{this.state.text}</Text>
        
      </ScrollPageView>
    );
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

  async componentDidMount(){
    this.btc = new Btc('a');
    await this.btc.init();
  }
  
}
