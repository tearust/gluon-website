<template>
<div class="tea-page" style="padding-top: 10px;">
  <el-row style="margin-bottom: 4px;">
    <el-col v-if="step===1" style="font-size: 15px; color: #666;">
      Please select layer1 address first to continue.
    </el-col>
  </el-row>
  <el-row>
    <!-- <el-col :span="6">
      <strong style="line-height:40px;">Layer1 Account</strong>
    </el-col> -->
    <el-col :span="6">
      <el-select style="width: 100%;" :disabled="step!==1" v-model="layer1_account" placeholder="Please select account">
        <el-option
          v-for="(item, i) in layer1_account_list"
          :key="i"
          :label="item.name"
          :value="item.address">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="11" :offset="1" v-if="layer1_balance" style="
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    ">
      Locked/Balance/Layer1 Amount : {{layer1_balance.locked}}/{{layer1_balance.amount}}/{{layer1_amount}} <br/>
      TX_ID: {{deposit_tx_id}}
    </el-col>
    <el-col :span="6" v-if="layer1_balance" style="display:flex;">
      <el-button style="width:40%;" type="default" @click="getLayer1AccountBalance()">Refresh</el-button>
      <el-button style="width:58%;" type="primary" @click="layer1_deposit()">Deposit</el-button>
      
    </el-col>
  </el-row>

  <el-divider />

  <div v-if="step===1" class="">
    <h2>Select Delegate</h2>
    <el-table
      :data="S1.super_table"
      stripe
      border
      highlight-current-row
      @current-change="s1_tableSelectHandler"
      style="width: 100%">

      <el-table-column prop="name" width="70px;" label="Name"></el-table-column>
      <el-table-column prop="tea_id" width="280px;" label="TEA ID"></el-table-column>
      <el-table-column prop="http" label="HTTP"></el-table-column>
      <el-table-column prop="status" width="70px;" label="Status"></el-table-column>
        
    </el-table>

    <el-divider />
    <!-- <el-table
      :data="S1.table"
      stripe
      border
      highlight-current-row
      @current-change="s1_tableSelectHandler"
      style="width: 100%">
      <el-table-column prop="tea_id" width="250px;" label="TEA ID"></el-table-column>
      <el-table-column prop="http" label="HTTP"></el-table-column>
      <el-table-column prop="status" width="70px;" label="Status"></el-table-column>
        
    </el-table> -->

    <div style="display:flex; justify-content: flex-end;">
      <el-button :disabled="!S1.select || !layer1_account" style="width:40%;margin-top: 40px;" type="primary" round @click="s1_next()">Next Step</el-button>
    </div>
  </div>

  <div v-if="step===2" class="">
    <h2>Request selected to be my delegate.</h2>

    <h1 style="color:#0f0">{{S2.status ? 'Success': ''}}</h1>

    <div style="display:flex; justify-content: flex-end;">
      <el-button :disabled="!S2.status" style="width:40%;margin-top: 40px;" type="primary" round @click="s2_next()">Next Step</el-button>
    </div>
  </div>

  <div v-if="step===3">
    <h2>Errand Task</h2>
    
    <div class="s3-info" v-if="S3.ori_code">
      <h4>Deployed Code</h4>
      <el-row>
        <el-col :span="6">deployment_id_for_code</el-col>
        <el-col v-if="!S3.enable_edit" :span="18">{{S3.deployment_id_for_code}}</el-col>
        <el-col v-if="S3.enable_edit" :span="18">
          <el-input v-model="S3.deployment_id_for_code" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">pay_per_use</el-col>
        <el-col v-if="!S3.enable_edit" :span="18">{{S3.code_pay_per_use}}</el-col>
        <el-col v-if="S3.enable_edit" :span="18">
          <el-input v-model="S3.code_pay_per_use" />
        </el-col>
      </el-row>
    </div>
    <div class="s3-info" v-if="!S3.ori_code">
      <h4>Upload Code</h4>

      <el-row>
        <el-col :span="6">cid_of_code</el-col>
        <el-col :span="18">
          <UploadToIpfs 
            :onChange="(cid)=>{S3.cid_of_code = cid}"
            text="Upload the task Wasm"
            tip="Only receive [wasm]"
            accept="application/wasm" />
          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">cid_of_checker</el-col>
        <el-col :span="18">
          <UploadToIpfs 
            :onChange="(cid)=>{S3.cid_of_checker = cid}"
            text="Upload the task checker"
            tip="Only receive [wasm]"
            accept="application/wasm" />
          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">cid_of_description</el-col>
        <el-col :span="14">
          <JsonEditor v-if="!S3.cid_of_description" mode="code" :json="S3.cid_of_description_json" :onChange="(val)=>{S3.cid_of_description_json=val}" />
          <span v-if="S3.cid_of_description">
            {{S3.cid_of_description}}
          </span>
        </el-col>
        <el-col :offset="1" :span="3">
          <el-button v-if="!S3.cid_of_description" type="primary" plain @click="s3_code_desc_uploadToIpfs()">Upload to IPFS</el-button>
          <el-button v-if="S3.cid_of_description" type="primary" plain @click="S3.cid_of_description=null">Change desc</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="s3-info" v-if="S3.ori_data">
      <h4>Deployed Data</h4>
      <el-row>
        <el-col :span="6">deployment_id_for_data</el-col>
        <el-col v-if="!S3.enable_edit" :span="18">{{S3.deployment_id_for_data}}</el-col>
        <el-col v-if="S3.enable_edit" :span="18">
          <el-input v-model="S3.deployment_id_for_data" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">pay_per_use</el-col>
        <el-col v-if="!S3.enable_edit" :span="18">{{S3.data_pay_per_use}}</el-col>
        <el-col v-if="S3.enable_edit" :span="18">
          <el-input v-model="S3.data_pay_per_use" />
        </el-col>
      </el-row>
    </div>

    <div class="s3-info" v-if="!S3.ori_data">
      <h4>Upload Data</h4>
      <el-row>
        <el-col :span="6">cid_of_data</el-col>
        <el-col :span="18">
          <UploadToIpfs 
            :onChange="(cid)=>{S3.cid_of_data = cid}"
            text="Upload the data"
            tip=""
            accept="*/*" />
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="6">cid_of_description</el-col>
        <el-col :span="14">
          <JsonEditor v-if="!S3.cid_of_data_description" mode="code" :json="S3.cid_of_data_description_json" :onChange="(val)=>{S3.cid_of_data_description_json=val}" />
          <span v-if="S3.cid_of_data_description">
            {{S3.cid_of_data_description}}
          </span>
        </el-col>
        <el-col :offset="1" :span="3">
          <el-button v-if="!S3.cid_of_data_description" type="primary" plain @click="s3_data_desc_uploadToIpfs()">Upload to IPFS</el-button>
          <el-button v-if="S3.cid_of_data_description" type="primary" plain @click="S3.cid_of_data_description=null">Change desc</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="s3-info">
      <h4>Description</h4>
      <JsonEditor mode="form" :json="S3.desc_json" :onChange="(val)=>{S3.desc_json=val}" />
    </div>

    <div style="display:flex; justify-content: flex-end;">
      <el-button :disabled="false" style="width:40%;margin-top: 40px;" type="primary" round @click="s3_next()">Run Errand Task</el-button>
    </div>
  </div>

  <div v-if="step===4">
    <h2>Waiting for the Errand task result.</h2>
    <div>
      <h4>{{S4.task_id}}</h4>

      <p>
        <span v-if="!S4.result && !S4.error">
          <i class="el-icon-loading"></i>
          Loading...
        </span>
        <b v-if="S4.result">Result: <font style="color:#f0f; margin-left: 10px;">{{S4.result}}</font></b>
        <b v-if="S4.error" style="color:#f00;">{{S4.error}}</b>
      </p>
    </div>
    
    <el-divider v-if="S4.result_info" />
    <el-card v-if="S4.result_info">
      <div slot="header">
        <span>Details</span>
      </div>
      <el-row v-for="(item, i) in S4.result_info" :key="i" style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px;">
        <el-col :span="4">{{item.key}}</el-col>
        <el-col :span="20" v-html="item.value" style="word-break: break-all;"></el-col>
      </el-row>
    </el-card>
    <el-card v-if="S4.bills" style="margin-top: 8px;">
      <div slot="header">
        <span>Bills</span>
      </div>
      <el-row v-for="(item, i) in S4.bills" :key="i" style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px;">
        <el-col :span="4">{{item.key}}</el-col>
        <el-col :span="20" v-html="item.value" style="word-break: break-all;"></el-col>
      </el-row>
    </el-card>
  </div>


</div>
</template>
<script>
import utils from '../tea/utils';
import http from '../tea/http';
import _ from 'lodash';
import Layer1 from '../tea/layer1';
import Errand from '../workflow/Errand';
import UploadToIpfs from '../components/UploadToIpfs';
import JsonEditor from '../components/JsonEditor';

const desc_json = {
  payment: 10,
  delegator: 20,
  executor: 80
};

const desc_code_json = {
  "payment": {
    "account_id": "",
    "pay_per_use": 3,
  },
  "actor_bindings": [
    {
      "capability": "tea:tensorflow",
      "values": {

      }
    }
  ]
};
const desc_data_json = {
  "payment": {
    "account_id": "",
    "pay_per_use": 2,
  }
}

export default {
  components: {
    UploadToIpfs,
    JsonEditor,
  },
  data(){
    return {
      layer1_account_list: [],
      layer1_account: null,
      layer1_balance: null,
      layer1_amount: null,
      deposit_tx_id: null,
      step: 1,

      S1: {
        table: [],
        super_table: [],
        select: null
      },
      S2: {
        status: false
      },

      S3: {
        enable_edit: false,
        deployment_id_for_code: null,
        code_pay_per_use: 0,
        cid_of_description: null,
        cid_of_description_json: {},

        deployment_id_for_data: null,
        data_pay_per_use: 0,
        cid_of_data_description: null,
        cid_of_data_description_json: {},

        desc_json: desc_json,

        ori_code: null,
        ori_data: null,
      },

      S4: {
        task_id: null,
        result: null,
        error: null,

        result_info: null,
        bills: null
      }
    }
  },
  created(){
    this.er = null;
  },

  methods: {
    async layer1_deposit(){
      let number = await prompt("Plese input the number you wanna deposit");
      number = parseInt(number, 10);
      if(!number || number < 100){
        this.$message.error("invalid number");
        return false;
      }

      this.$root.loading(true);

      await this.er.depositToAgentAccount(number);
      this.layer1_refresh();

      this.$root.loading(false);   
    },
    layer1_refresh(){
      this.layer1_balance = this.er.layer1_balance;
      this.deposit_tx_id = this.er.deposit_tx_id;
      this.layer1_amount = this.er.layer1_account_amount;
    },
    s1_tableSelectHandler(v){
      this.S1.select = v;
    },
    async s1_next(){
      // check layer1 balance
      const b = await this.er.layer1.getAccountBalance(this.layer1_account);
      if(b < 1){
        this.$message.error("Not enough account balance, please recharge with the faucet link in top.");
        return false;
      }

      this.step = 2;

      const select = this.S1.select;
      utils.setHttpBaseUrl(select.http);

      this.er.setLayer1Account(this.layer1_account);
      this.$root.loading(true);
      await this.er.requestBeMyDelegate();

      this.layer1_refresh();
      this.S2.status = true;
      this.$root.loading(false);
    },

    async s2_next(){
      console.log(111, this.layer1_balance);
      // check
      if(this.layer1_balance.amount < 10){
        this.$message.error('Not sufficient money in this delegator, please deposit first and continue.');
        return false;
      }

      this.step = 3;

      const {deployed_code, deployed_data} = this.er;
      if(deployed_code){
        this.S3.deployment_id_for_code = deployed_code.deployment_id;
        this.S3.code_pay_per_use = deployed_code.pay_per_use;
        this.S3.ori_code = deployed_code.deployment_id;
      }
      else{
        const tmp_json = _.clone(desc_code_json);
        _.set(tmp_json, 'payment.account_id', this.er.layer1_account);
        this.S3.cid_of_description_json = tmp_json;
      }

      if(deployed_data){
        this.S3.deployment_id_for_data = deployed_data.deployment_id;
        this.S3.data_pay_per_use = deployed_data.pay_per_use;
        this.S3.ori_data = deployed_data.deployment_id;
      }
      else{
        const tmp_json = _.clone(desc_data_json);
        _.set(tmp_json, 'payment.account_id', this.er.layer1_account);
        this.S3.cid_of_data_description_json = tmp_json;
      }
    },

    async s3_next(){
      const {deployed_code, deployed_data} = this.er;
      if(!deployed_code){
        this.er.adhoc_code = {
          cid_of_code: this.S3.cid_of_code,
          cid_of_checker: this.S3.cid_of_checker,
          cid_of_description: this.S3.cid_of_description,
        }

        if(!this.S3.cid_of_code || !this.S3.cid_of_checker || !this.S3.cid_of_description){
          this.$message.error("Invalid upload code");
          return false;
        }
      }

      if(!deployed_data){
        this.er.adhoc_data = {
          cid_of_data: this.S3.cid_of_data,
          cid_of_description: this.S3.cid_of_data_description,
        }
        if(!this.S3.cid_of_data || !this.S3.cid_of_data_description){
          this.$message.error("Invalid upload data");
          return false;
        }
      }

      try{
        
 
        this.er.setDeployCodeAndData(
          this.S3.deployment_id_for_code,
          this.S3.code_pay_per_use,
          this.S3.deployment_id_for_data,
          this.S3.data_pay_per_use,
        );
        const error = await this.er.startTask(this.S3.desc_json, ()=>{
          this.$root.loading(true);
        });
        if(error){
          // alert(error);
          // return false;
        }
        this.er.layer1.buildCallback('SettleAccounts', async (rs)=>{
          console.log("layer1 task result => ", JSON.stringify(rs));

          const tid = utils.forge.util.hexToBytes(rs.errandUuid.toString().substr(2));
          const task_id = this.S4.task_id;
          console.log(tid, task_id, tid===task_id)
          if(tid !== task_id){
            console.warn('Not this task, ignore...');
            return false;
          }

          await this.showTaskResultInfo(rs);
          // const cid = utils.forge.util.hexToBytes(_.slice(rs.resultCid.toString(), 2).join(""));
          // await this.s4_result(cid);
          // this.er.loopTaskResult(false);
          await this.getLayer1AccountBalance();
          _.delay(()=>{
            this.getLayer1AccountBalance();
          }, 2000);
        });

        this.er.loopTaskResult(true, async (res)=>{
          const cid = res.result_cid;
          await this.s4_result(cid);
          this.er.loopTaskResult(false);
          await this.getLayer1AccountBalance();
        });

        this.S4.task_id = this.er.last_task_id;
        this.step = 4;

        // this.mock_s4();
      }catch(e){
        this.$message.error(e.toString());
      }finally{
        this.$root.loading(false);
      }
    },

    async showTaskResultInfo(json){
      try{
        const exec_json = await this.er.layer1.nodeByEphemeralId(json.executorEphemeralId);

        const list = [];
        list.push({
          key: 'Task Id',
          value: utils.forge.util.hexToBytes(json.errandUuid.toString())
        })
        list.push({
          key: 'Employer',
          value: json.employer,
        })
        list.push({
          key: 'Delegator',
          value: json.delegatorTeaId
        });
        
        list.push({
          key: 'Executer Tea Id',
          value: exec_json.teaId, //_.slice(exec_json.teaId, 2).join('')
        });
        
        list.push({
          key: 'Executer Peer Id',
          value: utils.forge.util.hexToBytes(exec_json.peerId)
        });

        list.push({
          key: 'Executer Status',
          value: exec_json.status
        });

        this.S4.result_info = list;
        const len = json.bills.length;
        this.S4.bills = _.map(json.bills, (item, i)=>{
          return {
            key: (i===len-2) ? 'Delegate Address' : (i===len-1) ? 'Exectuer Address' : ' -- ',
            value: item[0] + ' => '+(parseInt(item[1]) / this.er.layer1.asUnit()) + ' unit'
          }
        });

      }catch(e){
        this.$message.error(e.toString());
      }
      
    },

    mock_s4(){
      _.delay(async ()=>{
        // TODO remove mock
        const cid = 'QmTMXTS8BrrPZ5SdYGfttsjAotphtiPgUmBEd9gNsEeCRA';

        const res = await http.getFromIpfs(cid);
        const json = JSON.parse(utils.forge.util.decode64(res));
        this.S4.result = json.result + ' (This is mock result, not real.)';
      }, 2000);
    },
    async s4_result(cid){
      const res = await http.getFromIpfs(cid);
      if(res){
        let json = null;
        let ori_str = utils.forge.util.decode64(res);
        try{
          json = JSON.parse(ori_str);
        }catch(e){
          let tmp = utils.forge.util.bytesToHex(ori_str);
          tmp = utils.crypto.decode(tmp);
          json = JSON.parse(tmp);
        }
        // const json = JSON.parse(utils.forge.util.decode64(res));
        console.log('Get JSON from task result cid \n', json);
        if(json.error){
          this.S4.error = json.error;
        }
        else{
          this.S4.result = json.result;
        }
        
      }
      
    },
    async getLayer1AccountBalance(){
      await this.er.getLayer1AccountBalance();
      this.layer1_refresh();
    },

    async s3_code_desc_uploadToIpfs(){
      const json_str = JSON.stringify(this.S3.cid_of_description_json);
      const cid = await http.putToIpfs(json_str);
      this.S3.cid_of_description = cid;
    },
    async s3_data_desc_uploadToIpfs(){
      const json_str = JSON.stringify(this.S3.cid_of_data_description_json);
      const cid = await http.putToIpfs(json_str);
      this.S3.cid_of_data_description = cid;
    }

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
    const xxx = utils.bootstrapNodesList();
    const txx = _.keys(xxx);

    const list = [];
    const s_list = [];
    _.each(tmp_list, (item)=>{
      if(_.includes(txx, item.tea_id)){
        item.name = xxx[item.tea_id];
        s_list.push(item);
      }
      else{
        item.name = '';
        list.push(item);
      }
    });

    const x_tmp = _.filter(list, (x)=>x.status === 'Active');
    this.S1.super_table = _.concat(s_list, x_tmp);

    this.er = new Errand();
    await this.er.init();

    let tmp = await this.er.layer1.extension.getAllAccounts();
    tmp = _.map(tmp, (item)=>{
      (async ()=>{
        item.balance = await this.er.layer1.getAccountBalance(item.address);
        item.name = item.name + '  -  ' + item.balance;
      })();
      return item;
    });
    this.layer1_account_list = await tmp;

    this.$root.loading(false);

    this.S3.enable_edit = utils.get_env('enable_edit')==='1';
    // await this.showTaskResultInfo();
    
  },

}
</script>
<style lang="scss" scoped>
.s3-info{
  padding: 15px 0;
  border-bottom: 1px solid #c9c9c9;

  h4{
    margin: 4px 0 20px;
    font-size: 25px;
    color: #b8b8b8;
  }

  .el-row{
    padding: 4px 0;
    margin-bottom: 15px;

    .el-col:first-child{
      font-weight: bold;
    }
    .el-col:last-child{

    }

  }

}
</style>
