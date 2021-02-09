<template>
<div class="tea-page h-center">

  <div class="tea-card mb" v-for="(item, i) in btc_list" :key="i">
    <i class="x-icon el-icon-check"></i>

    <div class="x-list">
      <div class="x-item">
        <b>TYPE</b>
        <span>{{item.type}}</span>
      </div>
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{item.account}}</span>
      </div>
      <div class="x-item">
        <b>BALANCE</b>
        <span>{{item.balance}}</span>
      </div>
      <div class="x-item">
        <b>STATUS</b>
        <span :class="'x-status '+item.status"></span>
      </div>

    </div>

    <div class="x-right">
      <el-button class="">SEND</el-button>
      <el-button class="">RECEIVE</el-button>
      <el-button class="gray" >REMOVE</el-button>
    </div>
  </div>

  <el-divider v-if="btc_list.length>0" />
  
  <div class="tea-card flex-center gray">
    <el-button class="x-only-btn" icon="el-icon-plus" @click="browserGenerateAccount()">ADD BTC</el-button>
  </div>

</div>
</template>
<script>
import {mapState, mapGetters} from 'vuex';
import Base from '../workflow/Base';
import _ from 'lodash';

export default {
  data() {
    return {
      
    };
  },
  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'btc_list'
    ]),
  },
  async mounted(){
    this.$root.loading(true);

    this.wf = new Base();
    await this.wf.init();

    this.refreshAsset();
    this.$root.loading(false);

  },
  methods: {
    async browserGenerateAccount(){
      try{
        const delegator = await this.wf.gluon.getSelectDelegator();
        if(!delegator){
          throw 'No delegator in layer1, please check.';
        }
        const json = await this.wf.gluon.browserGenerateAccount(this.layer1_account.address, 'bitcoin_mainnet', delegator.rsa);

        json.address = this.layer1_account.address;
        json.type = 'account';

        const tmp = this.wf.gluon.zipJsonSize(json);
        const text = JSON.stringify(tmp);
        console.log(text);
        this.wf.showQrCodeModal({
          text: text,
        });
      }catch(e){
        this.$root.showError(e);
      }
    },
    async browserGenerateAccount_mock(){
      this.$store.commit('add_btc_account_mock');
    },

    refreshAsset(){
      this.$store.dispatch('set_asset');
    }
  }
}
</script>
<style lang="scss">

</style>