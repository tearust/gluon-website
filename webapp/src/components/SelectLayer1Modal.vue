<template>

<el-dialog
  title="LAYER1 ACCOUNT"
  :visible.sync="visible"
  width="900"
  custom-class="tea-modal"
  @open="openedHandler"
  @closed="closedHandler"
  :before-close="handleClose">

  <h6>Please Select Layer1 Account.</h6>

  <div class="center" v-if="!loading">

    <el-select style="width: 400px;" :value="layer1_account ? layer1_account.address : null" @change="layer1ChangeHandler($event)" placeholder="Please select account">
      <el-option
        v-for="(item, i) in layer1_account_list"
        :key="i"
        :label="item.name"
        :value="item.address">
      </el-option>
    </el-select>

  </div>

  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">Close</el-button>
  </span>

</el-dialog>
</template>
<script>
import PubSub from 'pubsub-js';
import { mapGetters, mapState } from 'vuex';
import SettingAccount from '../workflow/SettingAccount';
import _ from 'lodash';
export default {
  data(){
    return {
      visible: false,
      params: null,
      layer1_account_list: [],

      loading: false,
    }
  },

  computed: {
    ...mapGetters([
      'layer1_account'
    ])
  },

  methods: {
    handleClose(){
      this.visible = false;
    },

    async openedHandler(){
      this.loading = true;
      let tmp = await this.sa.getAllLayer1Account();
      tmp = _.map(tmp, (item)=>{
        (async ()=>{
          item.balance = await this.sa.layer1.getAccountBalance(item.address);
          item.ori_name = _.clone(item.name);
          item.name = item.name + '  -  ' + item.balance;
        })();
        return item;
      });
      this.layer1_account_list = await tmp;
      this.loading = false;
    },

    closedHandler(){
      this.sa.refreshCurrentAccount();
    },

    layer1ChangeHandler(account){
      const ac = _.find(this.layer1_account_list, (item)=>item.address === account);
      this.$store.commit('set_account', ac);
    },
  },

  created(){
    PubSub.unsubscribe('tea-select-layer1-modal');
    PubSub.subscribe('tea-select-layer1-modal', (msg, visible)=>{
      this.visible = visible;
       
    })
  },

  async mounted(){
    this.$root.loading(true);
    this.sa = new SettingAccount();
    await this.sa.init();

    this.$root.loading(false);

  },
}
</script>