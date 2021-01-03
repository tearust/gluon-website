<template>

<el-dialog
  title="QR CODE"
  :visible.sync="visible"
  width="800"
  custom-class="tea-modal"
  @opened="openedHandler"
  @close="closedHandler"
  :before-close="handleClose">

  <h6>Please scan the QR Code with mobile app.</h6>

  <div id="js_qr_code" class="center"></div>

  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">Close</el-button>
  </span>

</el-dialog>
</template>
<script>
import PubSub from 'pubsub-js';
import QRCode from '../shared/libs/QRCode';
import _ from 'lodash';
export default {
  data(){
    return {
      visible: false,
      params: null,
    }
  },

  methods: {
    handleClose(){
      this.visible = false;
    },

    openedHandler(){
      const opts = this.params;

      new QRCode('js_qr_code', {
        text: opts.text,
        width: 256,
        height: 256,
        colorDark : '#35a696',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
      });
    },

    closedHandler(){
      document.querySelector('#js_qr_code').innerHTML = '';
    }
  },

  created(){
    PubSub.unsubscribe('tea-qrcode-modal');
    PubSub.subscribe('tea-qrcode-modal', (msg, opts={})=>{
      if(opts.visible){
        this.visible = true;
        this.params = opts;       
      }
      else{
        this.visible = false;
      }
       
    })
  }
}
</script>