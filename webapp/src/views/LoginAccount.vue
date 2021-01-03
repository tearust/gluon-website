<template>
<div class="tea-page">

  <h4>Current Layer1 Account</h4>
  <p v-if="layer1_account">{{layer1_account.name}}</p>
  <p v-if="layer1_account">{{layer1_account.address}}</p>
  <el-divider />
  <h4>Setting Your Layer1 Account</h4>

  <el-select style="width: 400px;" :value="layer1_account ? layer1_account.address : null" @change="layer1ChangeHandler($event)" placeholder="Please select account">
    <el-option
      v-for="(item, i) in layer1_account_list"
      :key="i"
      :label="item.name"
      :value="item.address">
    </el-option>
  </el-select>
</div>
</template>
<script>
import SettingAccount from '../workflow/SettingAccount';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex'
export default {
  data(){
    return {
      layer1_account_list: [],
    };
  },

  computed: {
    ...mapGetters([
      'layer1_account'
    ])
  },
  
  async mounted(){
    this.$root.loading(true);
    this.sa = new SettingAccount();
    await this.sa.init();

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

    this.$root.loading(false);

  },

  methods: {
    layer1ChangeHandler(account){
      const ac = _.find(this.layer1_account_list, (item)=>item.address === account);
      this.$store.commit('set_account', ac);
    }
  }
}
</script>