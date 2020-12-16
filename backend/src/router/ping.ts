import Base from './Base';
import {crypto} from '../utility';

export default class extends Base {

  async action(){
    // console.log(crypto.sha('accenture'));
    return this.result(1, 'pong')
  }
}