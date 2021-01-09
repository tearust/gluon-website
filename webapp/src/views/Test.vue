<template>
<div class="tea-page">
  <!-- <h4>Test Page</h4> -->

  <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>
  <el-divider />

  <el-button type="primary" @click="showSelectLayer1()">SELECT LAYER1</el-button>
  <el-divider />

  <el-button type="primary" @click="pairWithMobile()">PAIR WITH MOBILE</el-button>
  <el-divider />

  <el-button type="primary" @click="mobileResponsePair()">MOBILE RESPONSE PAIR</el-button>
  <el-divider />

</div>
</template>
<script>
import Test from '../workflow/Test';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex'
export default {
  data(){
    return {
      nonce: null,
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
      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    },

    async mobileResponsePair(){
      // if(!this.nonce){
      //   return alert('pair first');
      // }
      const ac = this.test.layer1.getDefaultAccount('Bob');

      try{
        const nonce = this.test.gluon.getRandomNonce(); //this.nonce;
        await this.test.gluon.responePairWithNonce(nonce, ac, this.layer1_account.address);

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    }
  },

}
</script>