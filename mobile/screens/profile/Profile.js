import React from 'react';
import {Button, Input, Image, Icon, ListItem, Avatar} from 'react-native-elements';
import {Base, _, UI, createContainer} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress} from '@ant-design/react-native';


import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import userAction from '../../store/action/user';


export default createContainer(class extends Base {
  
  renderMain(p, s){
    
    const {pair_info} = this.props;
    return (
      <ScrollPageView 
        header={this.renderHeader()} 
        style={{paddingTop: 0}}
        contentStyle={{paddingLeft:0, paddingRight:0}}
      >
        
        {this.renderEachListItem({
          title: 'LAYER1 ACCOUNT',
          status: true,
          cb(){
            this._goPath('layer1_account_profile')
          }
        })}

        {this.renderEachListItem({
          title: 'PAIR INFO',
          status: !!pair_info,
          cb(){
            this._goPath('pair_info_profile')
          }
        })}

      </ScrollPageView>
    );
  }

  renderEachListItem(item){
    return (
      <ListItem bottomDivider onPress={item.cb.bind(this, item)}>
        {
          item.status ? 
          (<Icon type="ionicon" name="checkmark-outline" color="green" />)
          :
          (<Icon type="ionicon" name="close-outline" color="red" />)
        }
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
        </ListItem.Content>
 
        <ListItem.Chevron type="ionicon" name="chevron-forward-outline" size={24} color="#9c9c9c" />
      </ListItem>
    );
  }

  renderHeader(){
    return (
      <Header 
        title="Profile"
        leftComponent={null}
        rightComponent={
          <View style={{flex:1, flexDirection:'row', width:60, top: 10, right: 15, justifyContent:'space-between'}}>
            
          </View>
        }
      />
    )
  }

  async componentDidMount(){
    
  }

  async componentActive(){
    UI.loading(true);
    await this.props.refreshAccount();
    UI.loading(false);
  }
  
  
}, (state)=>{
  return {
    pair_info: state.user.pair_info,
  };
}, (dispatch)=>{
  return {
    refreshAccount(){
      dispatch(userAction.refresh())
    }
  };
});
