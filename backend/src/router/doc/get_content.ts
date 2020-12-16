import Base from '../Base';
import {_} from '../../utility';
import DocService from '../../service/DocService';

export default class extends Base {

  async action(){
    const ds = this.buildService(DocService);

    const path = this.getParam('path');
    const rs = await ds.getMdFileContent(decodeURIComponent(path));

    return this.result(1, rs);
    
  }
}