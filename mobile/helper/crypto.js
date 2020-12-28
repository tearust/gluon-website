import _ from 'lodash';
import forge from 'node-forge';

const F = {
  stringToU8(str){
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }
  
    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
  },
  u8ToString(u8_arr){
    var dataString = "";
    for (var i = 0; i < u8_arr.length; i++) {
      dataString += String.fromCharCode(u8_arr[i]);
    }
  
    return dataString;
  },

  sha256(data){
    const tmp = forge.sha256.create();
    tmp.update(data);
    return tmp.digest();
  }
};


export default F;