import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

const F = {
  async get(key){
    let data = await AsyncStorage.getItem(key);
    if(!data) return null;
    data = JSON.parse(data);
    if(!data.data) return null;

    // TODO validate timestampe

    return data.data;
  },

  async set(key, value){
    const data = {
      data: value,
      time: Date.now(),
    };

    const data_str = JSON.stringify(data);

    return await AsyncStorage.setItem(key, data_str);
  },

  async remove(key){
    return await AsyncStorage.removeItem(key);
  },

  clearAll(){
    // TODO
  }
};

const _mem = {};
F.mem = {
  set(key, value){
    _.set(_mem, key, value);
  },
  get(key){
    return _.get(_mem, key, null);
  },
  merge(key, value){
    const val = _.get(_mem, key) || {};
    _.set(_mem, key, _.extend(val, value));
  }
};

export default F;