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
    </div>
  </div>

  <el-divider />

  <div class="tea-card mb">
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

  <div class="tea-card flex-center gray">
    <el-button class="x-only-btn">BIND MOBILE</el-button>
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

    this.sa = new SettingAccount();
    await this.sa.init();

    this.$root.loading(false);

  },

  methods: {
    showSelectLayer1(){
      this.sa.showSelectLayer1Modal();
    }
  }
}
</script>