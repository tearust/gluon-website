import Base from '../Base';
import {_} from '../../utility';
import DocService from '../../service/DocService';

export default class extends Base {

  async action(){
    const ds = this.buildService(DocService);

    const rs = await ds.getMdFileList();

    return this.result(1, rs);
    
  }
}