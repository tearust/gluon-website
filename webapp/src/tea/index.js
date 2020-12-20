import utils from './utils';
import nkn from './nkn';
import ws from './ws';
import http from './http';
import proto from './proto';
import Layer1 from './layer1';

export default class {
  constructor(active_nodes){
    this.ready = 0;

    this.nkn = null;
    this.ws = null;
    this.active_nodes = [active_nodes];

    this.node = active_nodes;

    this.layer1 = null;
  }

  async connect(){
    if(this.ready > 0) return false;
    this.ready = 1;
    

    this.channel = this.configChannelByActiveNode(this.active_nodes[0]);
    
    await this.createMessageChannel();
    this.ready = 2;
    console.log('tea connect success');

    await this.initLayer1();
  }

  async initLayer1(){
    if(!this.layer1){
      try{
        this.layer1 = new Layer1();
        await this.layer1.init();

      }catch(e){
        console.log(e);
      }
      
    }
    
  }

  sortActiveNodes(node_list){
    // TODO sort by weight

    return node_list;
  }

  configChannelByActiveNode(info){
    const rs = {};
    // if(info.ws){
    //   rs.type = 'ws';
    //   rs.address = info.ws;
    // }
    // else if(info.nkn_id){
    //   rs.type = 'nkn';
    //   rs.address = info.nkn_id;
    // }
    // else{
    //   console.log(info);
    //   throw 'invalid active node';
    // }

    return rs;
  }

  async createMessageChannel(){
    if(this.channel.type === 'ws'){
      this.ws = new ws(this.channel.address);
    }
    else {
      this.nkn = new nkn(null, this.channel.address);
    }
  }

  async sendTask(bodyCid){

    const {hex, key_encrypted} = utils.crypto.get_secret();
    const param = {
      task_cid: bodyCid,
      sec_key: {
        // key1: key_encrypted,
        key1: hex
      }
    };

    const payload = {
      __tea_subject: 'api.actor_task',
      __tea_object: param
    };

    console.log(11, payload);

    let rs = null;
    if(this.channel.type === 'ws'){
      rs = await this.ws.sendTask(payload);
    }
    else if(this.channel.type === 'nkn'){
      rs = await this.nkn.sendTask(payload);
    }
    else{
      throw 'active node is invalid';
    }

    console.log("rs => ", rs);
    return rs;
  }

  async registerNewTask(gas){
    const wasm = {
      cid: utils.cache.get('wasm_file_cid'),
      hash: proto.stringToU8(utils.cache.get('wasm_file_hash'))
    };
    const wasmManifest = {
      cid: utils.cache.get('wasm_fest_file_cid'),
      hash: proto.stringToU8(utils.cache.get('wasm_fest_file_hash'))
    };
    const wasmChecker = {
      cid: utils.cache.get('checker_file_cid'),
      hash: proto.stringToU8(utils.cache.get('checker_file_hash'))
    };
    const cidHash = [{
      cid: utils.cache.get('img_file_cid'),
      hash: proto.stringToU8(utils.cache.get('image_file_hash'))
    }];

    const p = new proto.Protobuf('actor_delegate.TaskRegisterRequest');
    
    const payload = {
      cidHash,
      blockChainAccount: proto.stringToU8(this.node.tea_id),
      wasm,
      wasmManifest,
      wasmChecker,
      payment: gas
    };
    console.log(22, payload);
    p.payload(payload);
    const buf = p.encode();
    console.log(11, buf);
    // const dd = p.decode(buf);
    // console.log(22, dd);

    const base64 = utils.uint8array_to_base64(buf);
    console.log(888, base64);
    return http.registerNewTask(base64);
  }

  async putTaskBodyToIpfs({rsaPub}){
    const {key_encrypted} = utils.crypto.get_secret();
    console.log(44, key_encrypted);
    const payload = {
      // refNum,
      // rsaPub,
      capCid: utils.cache.get('checker_file_cid'),
      manifestCid: utils.cache.get('wasm_fest_file_cid'),
      wasmCid: utils.cache.get('wasm_file_cid'),
      dataCid: utils.cache.get('img_file_cid'),
      ekey1: proto.stringToU8(key_encrypted),
    };
    const p = new proto.Protobuf('actor_delegate.TaskBody');
    console.log('payload', payload);
    p.payload(payload);
    const buf = p.encode();
    console.log('buf', buf);
    // const base64 = utils.uint8array_to_base64(buf);
    // console.log(999, base64);
    // const dd = p.decode(buf);
    // console.log('decode => ', dd);

    return http.putToIpfs(utils.uint8array_to_arraybuffer(buf));
  }

  async addNewTask(account, param, callback){
    return await this.layer1.addNewTask(account, param, callback);
  }

}