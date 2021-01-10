import Base from './Base';
import pubsub from './pubsub';

import {_, moment, EStyle, util} from './utils';
import UI from './UI';
import cache from './cache';
import native from './native';
import request from './request';
import Btc from './Btc';
import crypto from './crypto';

import {connect} from 'react-redux';


const init = (param)=>{
	param = _.extend({
		theme : 'default',
		themeStyle : {}
	}, param||{});


	EStyle.build(_.merge({}, param.themeStyle));
};

const createContainer = (ELEM, mapState, mapDispatch)=>{
	return connect(mapState, mapDispatch)(ELEM);
};

export {
	createContainer,
	Base,
	_,
	UI,
	moment,
	EStyle,
	util,
	init,
	pubsub,
	cache,
	native,
	request,
	Btc,
	crypto,
};
