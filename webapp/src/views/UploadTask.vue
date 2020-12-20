<template>
<div class="tea-page">
  
<div v-if="!result">
  <TaskStep :step="3" />
  <el-form :model="form" label-width="140px" class="p-uploadwasm">

    <el-form-item label="Account">
      <el-select v-model="form.public_key" placeholder="Please select account">
        <el-option
          v-for="(item, i) in account_list"
          :key="i"
          :label="item.name"
          :value="item.address">
        </el-option>
      </el-select>
      <span style="display:block; color:#ccc;">If no account, please intall the chrome plugin and create account.</span>
    </el-form-item>
    <el-form-item label="Gas">
      <el-input v-model="form.gas"></el-input>
    </el-form-item>

    <el-form-item v-if="!isDapp" label="Checker Cid">
      <el-input disabled v-model="form.res.checker"></el-input>
    </el-form-item>

    <el-form-item label="Image Cid">
      <el-input disabled v-model="form.res.image"></el-input>
    </el-form-item>

    <el-form-item v-if="!isDapp" label="Manifest Cid">
      <el-input disabled v-model="form.res.wasm_fest"></el-input>
    </el-form-item>

    <el-form-item v-if="!isDapp" label="Task Wasm Cid">
      <el-input disabled v-model="form.res.wasm"></el-input>
    </el-form-item>
    

  </el-form>

  <div style="display:flex; justify-content: space-between; margin-top: 40px;">
    <el-button style="width:40%;" 
      round 
      @click="clickPrev()">Prev Step</el-button>

    <el-button style="width:40%;" 
      type="success" 
      round 
      :disabled="!(form.public_key && form.gas!=='')"
      @click="clickSubmitHandler()">Send task to layer1</el-button>
  </div>
</div>

<div v-if="result">
  <h3 v-html="result"></h3>

  <!-- <el-button 
      type="primary" 
      round 
      :disabled="!(form.public_key && form.gas)"
      @click="clickSendTaskForTest()">Calculate task for Test</el-button> -->
</div>
  

</div> 
</template>

<script>
import tea from '../tea';
import TaskStep from '../components/TaskStep';
import utils from '../tea/utils';
import toHex from 'to-hex';
import _ from 'lodash';

export default {
  components: {
    TaskStep
  },
  data(){
    return {
      form: {
        public_key: '',
        gas: '0',
        res: {}
      },
      result: null,
      account_list: [],

      isDapp: false
    }
  },

  created() {
    this.tea = null;
    this.isDapp = utils.get_env('env') === 'dapp';

    console.log('env =>', process.env);
  },

  async mounted() {
    this.$root.loading(true);
    await this.init();

    this.account_list = await this.tea.layer1.extension.getAllAccounts();
    this.$root.loading(false);
  },

  methods: {
    async init(){
      this.form.res = {
        image: utils.cache.get('img_file_cid'),
        checker: utils.cache.get('checker_file_cid'),
        wasm: utils.cache.get('wasm_file_cid'),
        wasm_fest: utils.cache.get('wasm_fest_file_cid'),
      };

      const node = utils.cache.getNode();
      this.tea = new tea(node);
      await this.tea.connect();

      // console.log(this.tea);
    },

    
    async clickSubmitHandler(){
      this.$root.loading(true);

      // registr new task
      const {ref_num, rsa_pub_key, delegate_id} = await this.tea.registerNewTask(parseInt(this.form.gas, 10));

      console.log('ref_num =>', ref_num);
      console.log('rsa_pub_key =>', rsa_pub_key);
      console.log('delegate_id =>', delegate_id);

      utils.crypto.set_rsa_publickey(rsa_pub_key);

      // add new task
      // const ref_num = 33333;  
      const bodyCid = await this.tea.putTaskBodyToIpfs({
        rsaPub: rsa_pub_key,
      });
console.log("========= bodyCid : ", bodyCid);
      
      const new_task_param = {
        teaId: '0x'+delegate_id, 
        modelCid: '0x09',
        bodyCid: toHex(bodyCid, { addPrefix: true }),
        payment: this.form.gas,
        refNum: '0x'+ref_num,
      };
      console.log(777, new_task_param);

      this.tea.layer1.buildCallback('CompleteTask', (rs)=>{
        let tmp = rs.replace(/"/, '');
        tmp = _.slice(rs, 2).join("");
        console.log(tmp, utils.forge.util.hexToBytes(tmp));
        tmp = JSON.parse(utils.forge.util.hexToBytes(tmp));
        this.result = tmp.result;
      });

      try{
        await this.tea.addNewTask(this.form.public_key, new_task_param, (f, block)=>{
          if(f){
            this.result = `
              Block => ${block} <br/>
              Ref num => ${ref_num} <br/>
              Calculating...
            `;

            // this.form.public_key = '';
            this.form.gas = '10';
          }
        });
      }catch(e){
        // console.log(111, e);
        this.$message.error(e.toString());
      }finally{
        this.$root.loading(false);
      }
      
      
      
    },
    clickPrev(){
      this.$router.push('/upload_res');
    },

    async clickSendTaskForTest(){
      this.$root.loading(true);

      const bodyCid = await this.tea.putTaskBodyToIpfs({
        rsaPub: this.tea.node.rsa,
      });
      console.log('task body cid =>', bodyCid);

      try{
        const rs = await this.tea.sendTask(bodyCid);
        // this.$message.success(rs);
        this.result = rs;

        // this.form.public_key = '';
        this.form.gas = '10';
      }catch(e){
        this.$message.error(e);
      }finally{
        this.$root.loading(false);
        
      }
    }
  },

  
}
</script>


<style lang="scss">

</style>
