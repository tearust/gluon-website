import Base from '../Base';
import UserService from '../../service/UserService';
import {crypto} from '../../utility';

/**
 * login service
 * @param username
 * @param password
 * @returns {json} user
 */
export default class extends Base {

  async action(){
    const us = this.buildService(UserService);
    const params = this.getParam();
    try{
      const user = await us.login(params);
      const token = crypto.encrypt(user.id);
      this.setCookie('token', token);
      user.token = token;
      return this.result(1, user);
    }catch(error){
      return this.result(-1, error);
    }
    
  }
}