import * as _ from 'lodash'

export default class Base {
  public session
  public currentUser
  protected db;

  constructor(db, session){
    this.db = db;
    this.session = session || {};
    this.currentUser = session.user || null;

    this.init()
  }

  protected init(){}

  public getDBModel(name: string){
    return this.db.getModel(name);
  }



  protected getService<T extends Base>(service: { new(...args): T }): T{
    return new service(this.session)
  }
  
}