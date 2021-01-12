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
      <el-button v-if="layer1_account.address" @click="rechargeHandler()">RECHARGE</el-button>
    </div>
  </div>

  <el-divider />

  <div class="tea-card mb" v-if="bind_mobile">
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
      <el-button class="gray" @click="unpairHandler()" >UNPAIR</el-button>
    </div>
  </div>

  <div class="tea-card flex-center gray" v-if="!bind_mobile">
    <el-button @click="bindMobileHandler()" :disabled="!layer1_account.address" class="x-only-btn">BIND MOBILE</el-button>
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

    await this.refreshAccount();
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

        // start listening
        this.wf.gluon.buildCallback('RegistrationApplicationSucceed', (address1, address2)=>{
          if(_.includes([address1, address2], address)){
            this.wf.closeQrCodeModal();
            this.refreshAccount();
          }
        })

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
      await this.wf.refreshCurrentAccount();
    },

    async unpairHandler(){
      let f;
      try{
        await this.$confirm('Are you sure to unpair this device?', 'UNPAIR', {
          confirmButtonText: 'CONFIRM',
          cancelButtonText: 'CANCEL'
        });
        f = true;
      }catch(e){
        f = false;
      }

      if(!f) return false;
      this.$root.loading(true);

      try{
        await this.wf.gluon.unpair(this.layer1_account.address);
        await this.refreshAccount();

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }

      this.$root.loading(false);
    }
  }

  
}
</script>