import Base from '../Base';
import {crypto} from '../../utility';

export default class extends Base {

  async action(){
    const keypari = crypto.create_ed25519_keypair();

    return this.result(1, keypari)
  }
}