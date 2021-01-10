<template>
<div class="tea-page h-center">

  <div class="tea-card">
    <i class="x-icon el-icon-user"></i>

    <div class="x-list">
      <div class="x-item">
        <b>NAME</b>
        <span>{{layer1_account ? layer1_account.name : ''}}</span>
      </div>
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{layer1_account ? layer1_account.address : ''}}</span>
      </div>
      <div class="x-item">
        <b>BALANCE</b>
        <span>{{layer1_account ? layer1_account.balance : ''}}</span>
      </div>

    </div>

    <div class="x-right">
      <el-button @click="showSelectLayer1()">CHANGE</el-button>
      <el-button @click="rechargeHandler()">RECHARGE</el-button>
    </div>
  </div>

  <el-divider />

  <div class="tea-card mb" v-if="this.bind_mobile.address">
    <i class="x-icon el-icon-mobile-phone"></i>

    <div class="x-list">
      <div class="x-item">
        <b>UUID</b>
        <span>{{bind_mobile ? bind_mobile.uuid : ''}}</span>
      </div>
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{bind_mobile ? bind_mobile.address : ''}}</span>
      </div>

    </div>

    <div class="x-right">
      <el-button class="gray" >UNPAIR</el-button>
    </div>
  </div>

  <div class="tea-card flex-center gray" v-if="!this.bind_mobile.address">
    <el-button @click="bindMobileHandler()" :disabled="!this.layer1_account.address" class="x-only-btn">BIND MOBILE</el-button>
  </div>
  
</div>
</template>
<script>
import SettingAccount from '../workflow/SettingAccount';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex'
export default {
  data(){
    return {
      
    };
  },

  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'bind_mobile'
    ])
  },
  
  async mounted(){
    this.$root.loading(true);

    this.wf = new SettingAccount();
    await this.wf.init();

    this.refreshAccount();
    this.$root.loading(false);

  },

  methods: {
    showSelectLayer1(){
      this.wf.showSelectLayer1Modal();
    },

    async bindMobileHandler(){
      const address = this.layer1_account.address;
      const gluon = this.wf.gluon;
      try{
        const nonce = gluon.getRandomNonce();
        this.$root.loading(true);
        await gluon.sendNonceForPairMobileDevice(nonce, address);

        const json = {
          nonce,
          address,
          type: 'pair',
        };

        this.wf.showQrCodeModal({
          text: JSON.stringify(json),
        });
      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
        
      }finally{
        this.$root.loading(false);
      }
    },

    async rechargeHandler(){
      this.$root.loading(true);
      await this.wf.layer1.faucet(this.layer1_account.address);
      this.refreshAccount();
      
      this.$root.loading(false);
    },

    async refreshAccount(){
      if(this.layer1_account){
        const balance = await this.wf.layer1.getAccountBalance(this.layer1_account.address);
        this.$store.commit('set_account', {
          balance,
          address: this.layer1_account.address,
          ori_name: this.layer1_account.name,
        });
        console.log('===== refresh =====');
      }
    }
  }

  
}
</script>