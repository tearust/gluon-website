<template>
<div class="tea-page">
  <!-- <h4>Test Page</h4> -->

  <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>
  <el-divider />

  <el-button type="primary" @click="showSelectLayer1()">SELECT LAYER1</el-button>
  <el-divider />

  <el-button type="primary" @click="pairWithMobile()">PAIR WITH MOBILE</el-button>
  <el-divider />

</div>
</template>
<script>
import Test from '../workflow/Test';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex'
export default {
  data(){
    return {};
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

      await this.test.gluon.sendNonceForPairMobileDevice(address, (flag, rs)=>{
        console.log(1, flag, rs);
      })
    }
  },

}
</script>