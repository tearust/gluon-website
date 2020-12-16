import Base from '../Base';
import UserService from '../../service/UserService';

/**
 * check login status
 * @returns {currentUser}
 */
export default class extends Base {

  async action(){
    const us = this.buildService(UserService);
    const user = us.currentUser;
    
    if(user){
      return this.result(1, user);
    }

    return this.result(-1, 'token error');
  }
}