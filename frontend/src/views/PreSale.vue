<template>
  
<div class="c-page">

  <el-select style="width: 300px; height: 80px; float: right;" :value="layer1_account ? layer1_account.address : null" @change="layer1ChangeHandler($event)" placeholder="Please select POLKDOT account">
    <el-option
      v-for="(item, i) in layer1_account_list"
      :key="i"
      :label="item.name"
      :value="item.address">
    </el-option>
  </el-select>

  <div class="tea-card" v-if="layer1_account">
    <i class="x-icon el-icon-user"></i>

    <div class="x-list">
      <div class="x-item">
        <b>NAME</b>
        <span>{{layer1_account.name}}</span>
      </div>
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{layer1_account.address}}</span>
      </div>
      <div class="x-item">
        <b>BALANCE</b>
        <span>{{layer1_account.balance}}</span>
      </div>
      <div class="x-item">
        <b>SEED</b>
        <span>{{layer1_account.meta.seed}}</span>
      </div>

    </div>

  </div>
  <el-divider v-if="layer1_account" />

  <div v-if="table_data" style="position:relative;">

    <h4 style="margin: 30px 0 15px;">Booking Records</h4>

    <el-button type="primary" style="position:absolute;right:0;top:-10px;width:400px;font-size:16px;font-weight:bold;" @click="openModal()">Booking ({{seed_amount.now}}/{{seed_amount.total}})</el-button>

    <el-table
      :data="table_data"
      stripe
      size="medium"
      :border="true"
      show-header
    >
      <el-table-column
        prop="token"
        label="Token"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="Price"
        width="200">
      </el-table-column>
      <el-table-column
        prop="time"
        label="Time"
        width="200"
      >
      </el-table-column>

    </el-table>
  </div>

  <el-dialog
    :title="'Booking - ( '+seed_amount.now+' / '+seed_amount.total+' )'"
    :visible.sync="modal_visible"
    width="900"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="120px" style="margin: 0 20px 0;">
      <el-form-item label="Target Address">
        <el-input :value="form.target" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Price">
        <el-input :value="form.price" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Count">
        <el-select v-model="form.count">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="modal_visible = false">CANCEL</el-button>
      <el-button type="primary" @click="confirmHandler()">CONFIRM</el-button>
    </span>
  </el-dialog>

</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import presale from '../js/presale';
import _ from 'lodash';
import moment from 'moment';
export default {
  data(){
    return {
      layer1_account_list: [],
      table_data: null,

      seed_amount: {
        total: 0,
        now: 0,
      },

      modal_visible: false,
      form: {
        target: '',
        price: 10,
        count: 1,
      },
    };
  },
  computed: {
    ...mapGetters([
      'layer1_account'
    ])
  },
  async mounted(){
    this.$root.loading(true);
    const info = await presale.initLayer1();

    this.form.target = info.target_address;

    await this.initAllLayer1List();

    this.$root.loading(false);
  },

  methods: {
    async initAllLayer1List(){
      let tmp = await presale.getAllLayer1Account();
      tmp = _.map(tmp, (item)=>{
        (async ()=>{
          item.ori_name = _.clone(item.name);
        })();
        return item;
      });
      this.layer1_account_list = await tmp;
    },

    async layer1ChangeHandler(account){
      this.$root.loading(true);
      const ac = _.find(this.layer1_account_list, (item)=>item.address === account);
      const info = await presale.getLayer1AccountInfo(account);
      info.name = ac.name;
      console.log(11, info)
      this.$store.commit('set_account', info);

      const records = await presale.getPresaleRecordsByAddress(account);

      this.table_data = _.map(records, (item)=>{
        return {
          ...item,
          time: moment(item.time).format('YYYY-MM-DD hh:mm:ss'),
        }
      });

      await this.refreshSeedAmount();

      this.$root.loading(false);
    },

    async refreshSeedAmount(){
      const seed_amount = await presale.getSeedAmount();
      this.seed_amount = seed_amount;
    },

    openModal(){
      this.modal_visible = true;
    },

    async refresh(){
      await this.layer1ChangeHandler(this.layer1_account.address);
    },

    async confirmHandler(){
      const me = this.layer1_account.address;
      const tar = this.form.target;
      const amount = _.toNumber(this.form.price);
      const memo = '';

      const _layer1 = presale.getLayer1Instance();

      this.$root.loading(true);
      const rs = await _layer1.transferToken(me, tar, amount, memo);

      await this.refresh();
      this.$root.loading(false);
      this.modal_visible = false;

      
    }
  }
  
}
</script>