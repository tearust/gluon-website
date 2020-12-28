import secp256k1 from 'secp256k1';
import crypto from './crypto';
import forge from 'node-forge';
import cache from './cache';
import _ from 'lodash';

const { randomBytes } = require('crypto');

export default class {
  constructor(key){
    this.btc = null;

    this.pri = null;
    this.pub = null;

    this.key = 'btc-'+key;
  }

  async init(){
    const rs = await cache.get(this.key);
    if(rs){
      this.pri = Uint8Array.from(rs.pri.data);
      this.pub = Uint8Array.from(_.values(rs.pub));
    }
    else{
      const kp = this.createKeypair();
      this.setKeypair(kp.pri, kp.pub);

      await this.saveToLocal(this.pri, this.pub);
    }
  }


  createKeypair(){
    let privKey;
    do {
      privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey));

    const pubKey = secp256k1.publicKeyCreate(privKey);

    return {
      pri: privKey,
      pub: pubKey
    };
  }

  setKeypair(pri, pub){
    this.pri = pri;
    this.pub = pub;
  }

  sign(msg){
    this.validateKeypair();

    const ss = crypto.sha256(msg);
    const buf = crypto.stringToU8(ss.bytes());

    return secp256k1.ecdsaSign(buf, this.pri).signature;

  }

  verify(sig, msg){
    this.validateKeypair();

    const ss = crypto.sha256(msg);
    const buf = crypto.stringToU8(ss.bytes());

    return secp256k1.ecdsaVerify(sig, buf, this.pub);
  }

  validateKeypair(){
    if(!this.pri || !this.pub){
      throw 'btc keypair invalid';
    }
  }

  async saveToLocal(pri, pub){
    const val = {pri, pub};
    await cache.set(this.key, val);
  }

};