<template>
<div class="tea-page h-center">

  <div class="tea-card mb" v-for="(item, i) in btc_list" :key="i">
    <i class="x-icon el-icon-check"></i>

    <div class="x-list">
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{item.address}}</span>
      </div>
      <div class="x-item">
        <b>BALANCE</b>
        <span>{{item.balance}}</span>
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
    <el-button class="x-only-btn" icon="el-icon-plus">ADD BTC</el-button>
  </div>

</div>
</template>
<script>
import {mapState} from 'vuex';
export default {
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState([
      'btc_list'
    ]),
  },
  methods: {
    
  }
}
</script>