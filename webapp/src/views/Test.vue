<template>
<div class="tea-page">

  <h4>UTILITY</h4>
  <div class="t-box">
    <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>
    <el-button type="primary" @click="showSelectLayer1()">SELECT LAYER1</el-button>
    <!-- <el-button type="primary" @click="zipJsonSize()">ZIP JSON</el-button> -->
  </div>
  <el-divider />

  <h4>LAYER1 - PAIR</h4>
  <div class="t-box">
    <el-button type="primary" @click="pairWithMobile()">PAIR WITH MOBILE</el-button>
    <el-button type="primary" @click="mobileResponsePair()">MOBILE RESPONSE PAIR</el-button>
  </div>
  <el-divider />

  <h4>LAYER1 - GENERATE ACCOUNT</h4>
  <div class="t-box">
    <el-button type="primary" @click="getDelegatorList()">GET DELEGATORS</el-button>
    <el-button type="primary" @click="browserGenerateAccount()">BROWSER GENERATE ACCOUNT</el-button>
    <el-button type="primary" @click="appGenerateAccount()">APP GENERATE ACCOUNT</el-button>
  </div>
  <el-divider />
  <h4>LAYER1 - ASSETS</h4>
  <div class="t-box">
    <el-button type="primary" @click="getAssets()">GET ASSETS</el-button>
  </div>

  <el-divider />
  <h4>LAYER1 - TRANSACTION</h4>
  <div class="t-box">
    <el-button type="primary" @click="browserSignTx()">BROWSER SIGN TRANSACTION</el-button>
    <el-button type="primary" @click="appSignTx()">APP CONFIRM TRANSACTION</el-button>
    
  </div>


  <div class="x-log" v-if="latest_meta">
    <p v-for="(val, key) in latest_meta" :key="key">
      {{key}} => <span style="color:#0ff; word-break: break-all;">{{val}}</span>
    </p>
  </div>
</div>
</template>
<script>
import Test from '../workflow/Test';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
export default {
  data(){
    return {
      nonce: null,

      generate_account: null,

      delegator: null,
    };
  },

  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'bind_mobile',
      'latest_meta',
    ]),
  },

  async mounted(){
    this.$root.loading(true);

    this.test = new Test();
    await this.test.init();

    this.$root.loading(false);
  },

  methods: {
    showQrCode(){
      this.test.showQrCodeModal({
        text: 'jacky.li'
      })
    },
    showSelectLayer1(){
      this.test.showSelectLayer1Modal(true);
    },

    async pairWithMobile(){
      const address = this.layer1_account.address;

      // const ac = this.test.layer1.getDefaultAccount('Alice');
      try{
        const nonce = this.test.gluon.getRandomNonce();
        await this.test.gluon.sendNonceForPairMobileDevice(nonce, address);
        this.nonce = nonce;
        this.$message.success('success');

        // start listening
        this.test.gluon.buildCallback('RegistrationApplicationSucceed', (a, b)=>{
          console.log(12, a, b);
        })

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    },

    async mobileResponsePair(){
      const ac = this.test.layer1.getDefaultAccount('Bob');

      // console.log(ac.address);
      if(!this.nonce){
        return alert('pair first');
      }
      
      try{
        const nonce = this.nonce;
        await this.test.gluon.responePairWithNonce(nonce, ac, this.layer1_account.address, {
          uuid: 'AAABBBCCCDDDEEEFFF',
        });

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    },

    async getTeaNodes(){
      const nodes = this.test.gluon.getTeaNodes();
    },

    async getDelegatorList(){
      try{
        
        const delegator = await this.test.gluon.getSelectDelegator();
        this.delegator = delegator;

      }catch(e){
        this.showError(e);
      }
    },

    async browserGenerateAccount(){
      try{
        if(!this.delegator) throw 'Invalid delegator';

        const d = await this.test.gluon.browserGenerateAccount(this.layer1_account.address, 'bitcoin_mainnet', this.delegator.rsa);
        this.generate_account = d;
        this.$store.commit('set_meta', {
          delegator_nonce: d.nonce,
          delegator_nonce_hash: d.nonce_hash,
          delegator_nonce_rsa: d.nonce_rsa,
        });
      }catch(e){
        this.showError(e);
      }
    },

    async appGenerateAccount(){
      if(!this.generate_account){
        alert('error');
        return false;
      }
      try{
        const ga = this.generate_account;
        const ac = this.test.layer1.getDefaultAccount('Bob');
        const d = await this.test.gluon.appGenergateAccount(
          ac, ga.nonce, ga.nonce_hash, ga.nonce_rsa, ga.key_type, ga.p1, ga.p2_n, ga.p2_k, 
          this.layer1_account.address
        );

      }catch(e){
        this.showError(e);
      }
    },
    
    async getAssets(){
      const d = await this.test.gluon.getAssetsByAddress(this.layer1_account.address);
      console.log(11, d);
    },

    zipJsonSize(){
      const rs = this.test.gluon.zipJsonSize();
      console.log(JSON.stringify(rs));
    },

    async browserSignTx(){
      if(!this.latest_meta){
        alert('invalid meta');
        return false;
      }

      try{
        const {delegator_nonce_hash, delegator_nonce_rsa} = this.latest_meta; 
        const d = await this.test.gluon.browserSignTx(
          this.layer1_account.address, 
          '', 
          delegator_nonce_hash, 
          delegator_nonce_rsa
        );

        console.log(111, d);

      }catch(e){
        this.showError(e);
      }
    },


    showError(e){
      const err = e.message || e.toString();
      this.$alert(err, 'Layer1 Error', {
        type: 'error'
      });
    },
  },

}
</script>
<style lang="scss">
.t-box{
  display: flex;
  flex-direction: 'row';
}
.x-log{
  position: fixed;
  top: 80px;
  right: 0;
  width: 400px;
  background: #000;
  min-height: 200px;
  padding: 12px 15px;
  color: lime;
  
  p{
    margin: 0;
    margin-bottom: 8px;
  }
}
</style>