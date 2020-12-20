/**
 * Milestone1 workflow for deploy data
 * 
 */

import utils from '../tea/utils';
import proto from '../tea/proto';
import http from '../tea/http';

import Log from '../shared/utility/Log';

const log = Log.create('Deploy Data');

const {crypto} = utils;
const {Protobuf, stringToU8, u8ToString} = proto;

class DeployData {
  ori_data_buf = null;
  data_desc = null;
  price_plan = null;

  // encrypted
  data_buf = null;

  last_tx_id = null;
  last_layer1_account = null;

  aes_key = null;

  last_rsa_pub_key = null;
  last_ekey1 = null;
  last_session_id = null;


  constructor(ori_data_buf, data_desc, price_plan="A"){
    this.ori_data_buf = ori_data_buf;
    this.data_desc = data_desc;
    this.price_plan = price_plan;
  }

  async init(){
    this.aes_key = crypto.get_secret();

    this.data_buf = crypto.encode(this.ori_data_buf);
  }

  // send layer1 transaction to deposit money
  // return tx id
  async depositToAgentAccount(deposit_money){
    if(!deposit_money){
      throw 'invalid deposit money';
    }

    // TODO deposit money to agent account
    const rs = 'tx_id';

    this.last_tx_id = rs;
    log.d('tx id = ', this.last_tx_id);
    return rs;
  }

  buildRegisteDataProtobuf(){
    const pb = new Protobuf('actor_delegate.DataRegisterRequest');
    pb.payload({
      depositTxId: stringToU8(this.last_tx_id),
      blockChainAccount: stringToU8(this.last_layer1_account),
    });

    const buf = pb.encode();
    log.d('DataRegisterRequest = ', pb);

    const buf_64 = utils.uint8array_to_base64(buf);
    log.d('DataRegisterRequest base64 = ', buf_64);

    return buf_64;
  }

  async registeData(layer1_account){
    this.last_layer1_account = layer1_account;

    const buf_b64 = this.buildRegisteDataProtobuf();
    const rs = await http.registerData(buf_b64);
    log.d('registerData response = ', rs);

    this.last_rsa_pub_key = rs.rsa_pub_key;
    log.d(this.last_rsa_pub_key)
    crypto.set_rsa_publickey(this.last_rsa_pub_key);
    const {key_encrypted} = utils.crypto.get_secret();
    this.last_ekey1 = key_encrypted;
    log.d("ekey1", this.last_ekey1);
    this.last_session_id = rs.session_id;
    log.d("session_id", this.last_session_id);


    return true;
  }

  async uploadData(){
    const rs = await http.postDataWithRsaKey('data', this.data_buf, this.last_ekey1, this.last_session_id);
    log.d('uploadData response = ', rs);
    return rs;
  }
  async uploadDescription(){
    const desc = {
      "payment": {
        "account_id": this.last_layer1_account,
        "pay_per_use": this.data_desc.pay_per_use,
      },
    };
    const rs = await http.postDataWithRsaKey('description', JSON.stringify(desc), this.last_ekey1, this.last_session_id);

    log.d('uploadDescription response = ', rs);
    return rs;
  }
  async uploadCapchecker(){
    const rs = await http.postDataWithRsaKey('capchecker', "", this.last_ekey1, this.last_session_id);

    log.d('uploadCapchecker response = ', rs);
    return rs;
  }


  async start(layer1_account, deposit_money){
    // step 3
    await this.depositToAgentAccount(deposit_money || 0);

    // step 5
    await this.registeData(layer1_account);

    // step 8
    await this.uploadData();

    // step 9
    await this.uploadDescription();

    // step 10
    await this.uploadCapchecker();

    // TODO step 21
  }


  

}


export default DeployData;