<template>
<div class="tea-page">
  <!-- <h4>Test Page</h4> -->

  <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>

  <el-divider />

  <el-button type="primary" @click="showSelectLayer1()">SELECT LAYER1</el-button>

  <el-divider />

</div>
</template>
<script>
import Test from '../workflow/Test';
export default {
  data(){
    return {};
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
    }
  }
}
</script>