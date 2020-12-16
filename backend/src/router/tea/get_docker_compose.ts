import Base from '../Base';
import {crypto, _} from '../../utility';
import DocService from '../../service/DocService';

export default class extends Base {

  async action(){
    const keypari = crypto.create_ed25519_keypair();

    const ds = this.buildService(DocService);
    const file_content = await ds.getDockerComposeFileByName('demo');

    const rs_text = _.template(file_content)({
      tea_id_pub: keypari.pub,
      tea_id_pri: keypari.pri,
    })

    return this.result(1, rs_text);
  }
}