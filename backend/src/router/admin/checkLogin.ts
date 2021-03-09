import Base from '../Base';
import AdminUserService from '../../service/AdminUserService';

/**
 * check login status
 * @returns {currentUser}
 */
export default class extends Base {

  async action(){
    const us = this.buildService(AdminUserService);
    const user = us.currentUser;

    if(user){
      return this.result(1, user);
    }

    return this.result(-1, 'token error');
  }
}