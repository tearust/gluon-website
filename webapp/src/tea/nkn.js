import sdk from 'nkn-sdk';
import utils from './utils';

export default class {

  constructor(seed, target_address){
    // this.client = new sdk.Client({
    //   seed
    // });
    this.client = new sdk.MultiClient({
      numSubClients: 4,
      originalClient: false,
    });

    this.seed = this.client.getSeed();
    this.publicKey = this.client.getPublicKey();

    this.ready = 0;

    this.callback = null;
    this.target = target_address;

    this.init();
  }

  init(){
    if(this.ready > 0) return false;
    this.ready = 1;


    this.client.onMessage(({ src, payload }) => {
      console.log('Receive message', payload, 'from', src);
    });

    this.client.onConnect(()=>{
      this.ready = 2;

      console.log('nkn connect network success.');
    });
  }

  send(payload, callback){
    if(this.ready < 2){
      throw 'nkn not ready, please wait.';
    }

    this.client.send(this.target, payload).then((reply)=>{
      console.log('Receive reply:', reply);
      callback && callback.call(this.client, reply);
    });
  }

  async sendTask(payload){
    // TODO

    return new Promise((resolve, reject)=>{
      
      this.send(JSON.stringify(payload), (reply)=>{
        let {data} = JSON.parse(utils.convertU8ToString(reply));
        data = JSON.parse(data);
        console.log(11, data);

        const {result, error} = data;
        result ? resolve(result) : reject(error);

      });

    });
  }
   
}