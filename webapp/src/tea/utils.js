import * as uuid from 'uuid';
import _ from 'lodash';
import http from './http';
import proto from './proto';
import types from './types';
import Pubsub from 'pubsub-js';

import forge from 'node-forge';
import * as polk_util from '@polkadot/util';

const bootstrapNodesList = ()=>{
  return {
    '0xc9380fde1ba795fc656ab08ab4ef4482cf554790fd3abcd4642418ae8fb5fd52': 'Dave',
    '0xc7e016fad0796bb68594e49a6ef1942cf7e73497e69edb32d19ba2fab3696596': 'Bob',
    '0xdf38cb4f12479041c8e8d238109ef2a150b017f382206e24fee932e637c2db7b': 'Alice',
    '0x2754d7e9c73ced5b302e12464594110850980027f8f83c469e8145eef59220b6': 'Charlie',
  };
}

const cache = {
  put(id, data) {
    localStorage.setItem(id, JSON.stringify(data));
  },
  get(id) {
    const d = localStorage.getItem(id);
    try{
      return JSON.parse(d);
    } catch(e){
      return d;
    }
  },

  saveNode(node) {
    cache.put('select-node', node);
  },
  getNode(){
    const node = cache.get('select-node');
    if(!node) return null;

    // crypto.set_rsa_publickey(node.rsa);

    return node;
  }
};


const _secret = {
  key : null,
  iv : null,
  hex : null,

  rsa_key: null,
  key_encrypted: null
};
const crypto = {
  get_secret(input_key){
    if(!_secret.key){
      const __key = localStorage.getItem('crypto-secret-key');
      const key = input_key || __key || forge.random.getBytesSync(16);
      // const key = forge.random.generateSync(16);
      const iv = key;
      const hex = forge.util.bytesToHex(key);

      localStorage.setItem('crypto-secret-key', key);

      _secret.key = key;
      _secret.iv = iv;
      _secret.hex = hex;
    }
    return _secret;
  },

  set_rsa_publickey(rsa_key){
    delete _secret.rsa_key;
    if(!_secret.rsa_key){
      crypto.get_secret();
      _secret.rsa_key = rsa_key;

      console.log(222, _secret.hex);
      _secret.key_encrypted = crypto.rsaEncodeWithRsaPublickKey(_secret.hex, _secret.rsa_key);
    }
  },

  encode(buffer_data) {
    const {key, iv} = crypto.get_secret();
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(buffer_data));
    // console.log(111, forge.util.createBuffer(buffer_data))
    cipher.finish();
    const encrypted = cipher.output;

    // console.log(encrypted.toHex());
    return encrypted.toHex();
  },
  decode(hex) {
    const {key, iv} = crypto.get_secret();
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    const encryptedBytes = forge.util.hexToBytes(hex);
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

  // rsa encode with RSA_PUBLICKEY from step 1
  rsaEncodeWithRsaPublickKey(data, ras_pub){
    
    // TODO remove decode64 when runtime tpm privoder done.
    // const tmp = forge.util.decode64(ras_pub);
    const tmp = ras_pub;

    const pub = forge.pki.publicKeyFromPem(tmp);
console.log(789, data, ras_pub)
    let rs = pub.encrypt(data);
    // console.log('jjjj', forge.util.encode64(rs));
    console.log(22, forge.util.encode64(rs));
    return forge.util.encode64(rs);
  },

  sha256(data){
    const tmp = forge.sha256.create();
    tmp.update(data);
    return tmp.digest().toHex();
  }
};


let _http_base_url = '';
const F = {
  cache,
  crypto,
  proto,
  forge,
  polk_util,

  getHttpBaseUrl() {
    if(!_http_base_url){
      throw 'no http url';
      
    }

    return _http_base_url;
  },
  setHttpBaseUrl(url) {
    _http_base_url = url;
    http.initBaseUrl();
  },

  convertU8ToString(u8_array){
    return (_.map(u8_array, (x)=>String.fromCharCode(x))).join('');
  },

  uuid(){
    return uuid.v4();
  },

  uint8array_to_arraybuffer(uint8){
    return uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
  },
  uint8array_to_base64(uint8){
    uint8 = F.convertU8ToString(uint8);
    return forge.util.encode64(uint8);
  },


  get_env(key){
    if(key === 'env'){
      return process.env.NODE_ENV;
    }

    const x_key = 'VUE_APP_'+_.toUpper(key);
    return _.get(process.env, x_key, null);
  },
  print_layer1_types(){
    console.log(JSON.stringify(types));
  },
  bootstrapNodesList,

  publish(msg, data){
    Pubsub.publish(msg, data);
  }
};

window.utils = F;
export default F;