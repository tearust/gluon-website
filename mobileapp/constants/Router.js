import React from 'react';
import {View} from 'react-native';
import {TabBarIcon, TabBarText} from '../components/TabBar';

import BtcHome from '../screens/btc/Home';

import ProfileHome from '../screens/profile/index';

export default {
  init_tab: 'tab_btc',
  tab : [
    {
      name: 'tab_btc',
      component: BtcHome,
      options: {
        title: ({ focused })=><TabBarText text={'BTC'} focused={focused} />,
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="btc" />
      }
    },
    // {
    //   name: 'tab_calendar',
    //   component: ()=>null,
    //   options: {
    //     title: ({ focused })=><TabBarText text={'Calendar'} focused={focused} />,
    //     tabBarIcon: ({ focused }) => <TabBarIcon size={25} focused={focused} name="calendar-o" />
    //   }
    // },
    {
      name: 'tab_profile',
      component: ProfileHome,
      options: {
        title: ({ focused })=><TabBarText text={'Profile'} focused={focused} />,
        tabBarIcon: ({ focused }) => <TabBarIcon size={21} focused={focused} name="user-o" />
      }
    },

  ],
  modal : [
    
  ],

  stack : [
    
    
  ]
}