import Base from './Base';

export default class extends Base {
  defineLog(){
    return 'SettingAccount';
  }

  async getAllLayer1Account(){
    const all_account = await this.layer1.extension.getAllAccounts();

    return all_account;
  }

}