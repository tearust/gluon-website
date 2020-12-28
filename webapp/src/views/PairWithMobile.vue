<template>
<div class="tea-page">

  <b>Bootstrap node address: {{bootstrap}}</b>
  <h4>Candidate List</h4>

  <el-table
    :data="super_table"
    stripe
    border
    highlight-current-row
    @current-change="handleSelectChange"
    style="width: 100%">
    <el-table-column prop="name" width="70px" label="Name"></el-table-column>
    <el-table-column prop="tea_id" width="280px" label="TEA ID"></el-table-column>
    <el-table-column prop="http" label="HTTP"></el-table-column>
    <el-table-column prop="status" width="70px" label="Status"></el-table-column>
      
  </el-table>
  <el-divider />


  <div style="display:flex; justify-content: flex-end;">
    <el-button style="width:40%;margin-top: 40px;" type="primary" round @click="clickNext()">Next Step</el-button>
  </div>
  
</div>
</template>
<script>
import utils from '../tea/utils';
import http from '../tea/http';
import _ from 'lodash';
import Layer1 from '../tea/layer1';

export default {
  components: {

  },
  data() {
    return {
      bootstrap: null,
      super_table: [],
      table: [],
      select: null,

      mode: null,
      isDeployData: false,
      isDeployCode: false,
    }
  },
  created(){
    this.mode = utils.get_env('env');
    this.isDeployData = this.mode === 'deploy_data';
    this.isDeployCode = this.mode === 'deploy_code';
  },
  async mounted() {
    this.$root.loading(true);

    const obj = await Layer1.getBootstrapNodes();

    const tmp_list = _.map(obj, x => {
      const t = x.toJSON();
      t.tea_id = t.teaId;
      t.http = t.urls[0] ? utils.forge.util.hexToBytes(t.urls[0]) : '';
      return t;
    });
    const list = [];
    const s_list = [];
    const xxx = utils.bootstrapNodesList();
    const txx = _.keys(xxx);
    _.each(tmp_list, (item)=>{
      if(_.includes(txx, item.tea_id)){
        item.name = xxx[item.tea_id];
        s_list.push(item);
      }
      else{
        list.push(item);
      }
    });

    const x_tmp = _.filter(list, (x)=>x.status === 'Active');
    this.super_table = _.concat(s_list, x_tmp);
    this.$root.loading(false);
  },
  methods: {
    handleSelectChange(val) {
      this.select = val;
    },
    clickNext() {
      if(!this.select){
        this.$message.error("Select candidate first");
        return false;
      }
      console.log(this.select);
      utils.cache.saveNode(this.select);
      utils.setHttpBaseUrl(this.select.http);

      if(this.isDeployData){
        this.$router.push('/upload_data');
      }
      else if(this.isDeployCode){
        this.$router.push('/upload_code');
      }
      else{
        this.$router.push('/upload_res');
      }
      
    }
  }
}
</script>


<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>