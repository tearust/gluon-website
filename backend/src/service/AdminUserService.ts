import Base from './Base';
import {crypto, _} from '../utility';


export default class extends Base {
  public async login(params): Promise<any>{
    const {username, password} = params;

    const db = this.getDBModel('AdminUser');

    const query = {
      username,
      password: crypto.sha(password),
    };

    const one = await db.findOne(query);

    if(!one){
      throw 'invalid username or password';
    }

    return one;
  }
};