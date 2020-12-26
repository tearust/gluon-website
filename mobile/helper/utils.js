import _ from 'lodash';
import moment from 'moment';
import EStyle from 'react-native-extended-stylesheet';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const util = {

};

const IHSTYLE = {};
_.set(EStyle, 'set', (key, value)=>{
	IHSTYLE[key] = (value);
});
_.set(EStyle, 'get', (key)=>{
	return IHSTYLE[key] || {};
});

export {
	_,
	moment,
	EStyle,
	util
};