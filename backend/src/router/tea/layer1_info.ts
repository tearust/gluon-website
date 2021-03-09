import Base from '../Base';


export default class extends Base {

  async action(){
    const info = {
      url: process.env.LAYER1_URL,
      // account: process.env.LAYER1_ACCOUNT,
      address: process.env.LAYER1_ADDRESS
    };

    return this.result(1, info);
  }
}