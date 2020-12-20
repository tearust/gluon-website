<template>
<div class="tea-page">
  <DeployDataTaskStep :step="2" />

  <el-form :model="form" label-width="140px" class="p-uploadwasm">
    <el-form-item label="Image Data">
      <el-upload
        style="text-align:left;"
        action="/"
        accept="image/jpeg, image/png"
        :on-change="fileChangeHandler"
        :before-upload="uploadImage"

        :file-list="img_file?[img_file]:[]">
        <el-button size="small" type="primary">Upload the data image</el-button>
        <span slot="tip" class="el-upload__tip" style="margin-left: 8px;">Only receive [jpg/jpeg/png]</span>
      </el-upload>
    </el-form-item>

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

    <el-form-item label="Description">
      <!-- <el-input v-model="form.desc"></el-input> -->
      <JsonEditor :json="form.desc" mode="form" :onChange="(val)=>{form.desc=val}" />
    </el-form-item>

    <el-form-item label="Deposit Money">
      <el-input v-model="form.money"></el-input>
    </el-form-item>
    
  </el-form>

  
  <div style="display:flex; justify-content: space-between; margin-top: 40px;">
    <el-button style="width:40%;" 
      round 
      @click="clickPrev()">Prev Step</el-button>

    <el-button style="width:40%;" 
    type="primary" 
    round 
    :disabled="!res.image || !form.desc || !form.public_key"
    @click="clickNext()">Register Data</el-button>
  </div>
  
</div> 
</template>
<script>
import utils from '../tea/utils';
import http from '../tea/http';
import tea from '../tea';
import DeployDataTaskStep from './DeployDataTaskStep';
import DeployData from '../workflow/DeployData';
import JsonEditor from '../components/JsonEditor';
import _ from 'lodash';

const desc_default = {
  pay_per_use: 2
};

export default {
  components: {
    DeployDataTaskStep,
    JsonEditor
  },
  data() {
    return {
      account_list: [],
      form: {
        public_key: '',
        money: 10,
        desc: desc_default
      },
      img_file: null,

      res: {
        image: null,
      },

      node: null,
    };
  },

  created(){
    this.tea = null;
  },

  async mounted() {
    this.node = utils.cache.getNode();
    if(!this.node){
      this.$router.replace('/');
    }
    
    this.$root.loading(true);
    await this.init();
    this.account_list = await this.tea.layer1.extension.getAllAccounts();
    this.$root.loading(false);
  },
  
  methods: {
    reset(){
      this.form = {
        public_key : '',
        money : 10,
        desc : desc_default
      };
      this.img_file = null;
      this.res.image = null;
    },
    async init(){ 
      this.tea = new tea(this.node);
      await this.tea.connect();

      // console.log(this.tea);
    },
    fileChangeHandler(file){

    },
    build_to_file_list(cid){
      return {
        name: cid,
        url: cid
      };
    },
    uploadImage(file){
      this.processUploadFile(file, (cid, buf)=>{
        this.img_file = {
          name: file.name,
          url: file.name
        }
        
      });

      return false;
    },
    
    processUploadFile(file, callback){
      this.$root.loading(true);
      const fr = new FileReader();
      fr.onload = (e)=>{
        // const buf = (e.target.result.replace(`data:${file.type};base64,`, ''));
        let buf = e.target.result;

        this.res.image = buf;

        callback();
        this.$root.loading(false);

      };

      fr.readAsArrayBuffer(file);
      return false;
    },

    async clickNext(){
      const dd = new DeployData(this.res.image, this.form.desc);

      this.$root.loading(true);
      await dd.init();
      try{
        await dd.start(this.form.public_key, this.form.money);

        this.reset();

        this.$router.push('/deploy_result/'+dd.last_session_id);
      }catch(e){
        console.error(e);
      }finally{
        this.$root.loading(false);
      }
      
    },
    clickPrev(){
      this.$router.push('/');
    },

    
  }
}
</script>