<template>
<div class="tea-page">
  <h4>Test Page</h4>
  <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>


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
      this.test.showQrCode({
        text: 'jacky.li'
      })
    }
  }
}
</script>