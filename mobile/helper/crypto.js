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
  },

  aes(password, data) {
    const key = F.sha256(password).data;
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: key});
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encrypted = cipher.output;

    return encrypted.toHex();
  },
  des(password, encrypted_hex) {
    const key = F.sha256(password).data;
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: key});
    decipher.update()
    const encryptedBytes = forge.util.hexToBytes(encrypted_hex);
    const length = encryptedBytes.length;

    const chunkSize = 1024 * 64;
    let index = 0;
    let decrypted = '';
    do {
      decrypted += decipher.output.getBytes();
      const buf = forge.util.createBuffer(encryptedBytes.substr(index, chunkSize));
      decipher.update(buf);
      index += chunkSize;
    } while(index < length);
    decipher.finish();
    decrypted += decipher.output.getBytes();
    return decrypted;
  },
};


export default F;