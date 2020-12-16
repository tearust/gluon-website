import Base from '../Base';

/**
 * logout service 
 */
export default class extends Base {

  protected needLogin = true;
  async action(){
    this.res.clearCookie('token');
    
    return this.result(1, 'success');
  }
}