/**
 * Milestone1 workflow for deploy code
 * 
 */

import utils from '../tea/utils';
import proto from '../tea/proto';
import http from '../tea/http';

import Log from '../shared/utility/Log';

const log = Log.create('Deploy Code');

const { crypto } = utils;
const { Protobuf, stringToU8, u8ToString } = proto;

class DeployCode {
  ori_code_buf = null;
  ori_checker_buf = null;
  data_desc = null;
  price_plan = null;

  // encrypted
  code_buf = null;

  last_tx_id = null;
  last_layer1_account = null;

  aes_key = null;

  last_rsa_pub_key = null;
  last_ekey1 = null;
  last_session_id = null;

  constructor(ori_code_buf, ori_checker_buf, data_desc, price_plan = "A") {
    this.ori_code_buf = ori_code_buf;
    this.ori_checker_buf = ori_checker_buf;
    this.data_desc = JSON.stringify(data_desc);
    this.price_plan = price_plan;
  }

  async init() {
    this.aes_key = crypto.get_secret();

    this.code_buf = crypto.encode(this.ori_code_buf);
  }

  // send layer1 transaction to deposit money
  // return tx id
  async depositToAgentAccount(deposit_money) {
    if (!deposit_money) {
      throw 'invalid deposit money';
    }

    // TODO deposit money to agent account
    const rs = 'tx_id';

    this.last_tx_id = rs;
    log.d('tx id = ', this.last_tx_id);
    return rs;
  }

  buildRegisteServiceProtobuf() {
    const pb = new Protobuf('actor_delegate.DataRegisterRequest');
    pb.payload({
      depositTxId: stringToU8(this.last_tx_id),
      blockChainAccount: stringToU8(this.last_layer1_account),
    });

    const buf = pb.encode();
    log.d('ServiceRegisterRequest = ', pb);

    const buf_64 = utils.uint8array_to_base64(buf);
    log.d('ServiceRegisterRequest base64 = ', buf_64);

    return buf_64;
  }

  async registeService(layer1_account) {
    this.last_layer1_account = layer1_account;

    const buf_b64 = this.buildRegisteServiceProtobuf();
    const rs = await http.registerData(buf_b64);
    log.d('registeService response = ', rs);

    this.last_rsa_pub_key = rs.rsa_pub_key;
    log.d(this.last_rsa_pub_key)
    crypto.set_rsa_publickey(this.last_rsa_pub_key);
    const { key_encrypted } = utils.crypto.get_secret();
    this.last_ekey1 = key_encrypted;
    log.d("ekey1", this.last_ekey1);
    this.last_session_id = rs.session_id;
    log.d("session_id", this.last_session_id);

    return true;
  }

  async uploadData() {
    const rs = await http.postDataWithRsaKey('data', this.code_buf, this.last_ekey1, this.last_session_id);
    log.d('uploadData response = ', rs);
    return rs;
  }
  async uploadDescription() {
    let json = JSON.parse(this.data_desc);
    json.payment.account_id = this.last_layer1_account;
    const rs = await http.postDataWithRsaKey('description', JSON.stringify(json), this.last_ekey1, this.last_session_id);

    log.d('uploadDescription response = ', rs);
    return rs;
  }
  async uploadCapchecker() {
    const rs = await http.postDataWithRsaKey('capchecker', this.ori_checker_buf, this.last_ekey1, this.last_session_id);

    log.d('uploadCapchecker response = ', rs);
    return rs;
  }


  async start(layer1_account, deposit_money) {
    // step 3
    await this.depositToAgentAccount(deposit_money || 0);

    // step 5
    await this.registeService(layer1_account);

    // step 8
    await this.uploadData();

    // step 9
    await this.uploadDescription();

    // step 10
    await this.uploadCapchecker();

    // TODO step 21
  }

}


export default DeployCode;