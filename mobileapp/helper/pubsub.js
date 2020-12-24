import {DeviceEventEmitter} from 'react-native';

const map = {};
const F = {
  subscribe(msg, fn){
    F.remove(msg);
    const x = DeviceEventEmitter.addListener(msg, fn);
    map[msg] = x;
    return x;
  },
  publish(msg, ...args){
    DeviceEventEmitter.emit(msg, ...args);
  },
  remove(msg){
    if(map[msg]){
      map[msg].remove();
      delete map[msg];
    }
  }
};

export default F;