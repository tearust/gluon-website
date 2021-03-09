import Base from '../Base';
import AdminUserService from '../../service/AdminUserService';
import {crypto} from '../../utility';


export default class extends Base {

  async action(){
    const us = this.buildService(AdminUserService);
    const params = this.getParam();
    
    const user = await us.login(params);
    const token = user.token;
    this.setCookie('token', token);

    return this.result(1, token);
    
  }
}