import { web3Accounts, web3Enable, web3FromAddress, web3ListRpcProviders, web3UseRpcProvider } from '@polkadot/extension-dapp';
import _ from 'lodash';

class Extension {
  constructor(){

  }
  async init(){
    await web3Enable('tea-dapp');
  }

  async getAllAccounts(){
    const allAccounts = await web3Accounts();
    return _.map(allAccounts, (item) => {
      return {
        address: item.address,
        name: item.meta.name,
        type: 'injected'
      }
    });
  }

  async setSignerForAddress(address, api){
    const injector = await web3FromAddress(address);
    api.setSigner(injector.signer);
    return injector;
  }
}

export default new Extension();