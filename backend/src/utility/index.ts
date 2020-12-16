import * as _ from 'lodash';
import crypto from './crypto';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export {
  _,
  crypto,

};