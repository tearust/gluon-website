<template>
<div class="tea-page">
  
  <el-upload
    v-if="!isDapp"
    style="text-align:left;"
    action="/"
    accept="application/wasm"
    :on-change="fileChangeHandler"
    :before-upload="uploadChecker"
    :file-list="checker_file_cid?[checker_file_cid]:[]">
    <el-button size="small" type="primary">Upload the task checker</el-button>
    <div slot="tip" class="el-upload__tip">Only receive [wasm]</div>
  </el-upload>

  <el-upload
    style="text-align:left;margin-top: 40px;"
    action="/"
    accept="image/jpeg, image/png"
    :on-change="fileChangeHandler"
    :before-upload="uploadImage"

    :file-list="img_file_cid?[img_file_cid]:[]">
    <el-button size="small" type="primary">Upload the task image</el-button>
    <div slot="tip" class="el-upload__tip">Only receive [jpg/jpeg/png]</div>
  </el-upload>

  <el-upload
    style="text-align:left;margin-top: 40px;"
    action="/"
    v-if="!isDapp"
    accept="application/json"
    :on-change="fileChangeHandler"
    :before-upload="uploadWasmMainfest"
    :file-list="wasm_fest_file_cid?[wasm_fest_file_cid]:[]">
    <el-button size="small" type="primary">Upload the task manifest json</el-button>
    <div slot="tip" class="el-upload__tip">Only receive [json]</div>
  </el-upload>

  <el-upload
    style="text-align:left; margin-top: 40px;"
    action="/"
    v-if="!isDapp"
    accept="application/wasm"
    :on-change="fileChangeHandler"
    :before-upload="uploadWasm"
    :file-list="wasm_file_cid?[wasm_file_cid]:[]">
    <el-button size="small" type="primary">Upload the task actor</el-button>
    <div slot="tip" class="el-upload__tip">Only receive [wasm]</div>
  </el-upload>
  
  <div style="display:flex; justify-content: space-between; margin-top: 40px;">
    <el-button style="width:40%;" 
      round 
      @click="clickPrev()">Prev Step</el-button>

    <el-button style="width:40%;" 
    type="primary" 
    round 
    :disabled="!res.image || !res.checker || !res.wasm || !res.wasm_fest"
    @click="clickNext()">Next Step</el-button>
  </div>
  
</div> 
</template>
<script>
import utils from '../tea/utils';
import http from '../tea/http';
export default {
  data() {
    return {
      img_file_cid: null,
      checker_file_cid: null,
      wasm_file_cid: null,
      wasm_fest_file_cid: null,

      res: {
        image: null,
        checker: null,
        wasm: null,
        wasm_fest: null,
      },

      node: null,

      isDapp: false
    };
  },

  created(){
    this.isDapp = utils.get_env('env') === 'dapp';
    console.log('env =>', process.env);

  },

  mounted() {
    this.node = utils.cache.getNode();
    if(!this.node){
      this.$router.replace('/');
    }

    let cid = utils.cache.get('img_file_cid');
    if(cid){
      this.img_file_cid = this.build_to_file_list(cid);
      this.res.image = cid;
    }

    if(!this.isDapp){
      cid = utils.cache.get('checker_file_cid');
      if(cid){
        this.checker_file_cid = this.build_to_file_list(cid);
        this.res.checker = cid;
      }

      cid = utils.cache.get('wasm_file_cid');
      if(cid){
        this.wasm_file_cid = this.build_to_file_list(cid);
        this.res.wasm = cid;
      }

      cid = utils.cache.get('wasm_fest_file_cid');
      if(cid){
        this.wasm_fest_file_cid = this.build_to_file_list(cid);
        this.res.wasm_fest = cid;
      }
    }
    else{
      this.res.checker = utils.get_env('checker');
      utils.cache.put('checker_file_cid', this.res.checker);
      utils.cache.put('checker_file_hash', utils.get_env('checker_hash'));

      this.res.wasm = utils.get_env('wasm');
      utils.cache.put('wasm_file_cid', this.res.wasm);
      utils.cache.put('wasm_file_hash', utils.get_env('wasm_hash'));

      this.res.wasm_fest = utils.get_env('wasm_caps');
      utils.cache.put('wasm_fest_file_cid', this.res.wasm_fest);
      utils.cache.put('wasm_fest_file_hash', utils.get_env('wasm_caps_hash'));
    }
    
  },
  
  methods: {
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
        this.img_file_cid = this.build_to_file_list(cid);
        this.res.image = cid;
        utils.cache.put('img_file_cid', cid);

        utils.cache.put('image_file_hash', utils.crypto.sha256(buf));
      }, true);

      return false;
    },
    uploadChecker(file){
      this.processUploadFile(file, (cid, buf)=>{
        this.checker_file_cid = this.build_to_file_list(cid);
        this.res.checker = cid;
        utils.cache.put('checker_file_cid', cid);
        utils.cache.put('checker_file_hash', utils.crypto.sha256(buf));
      });

      return false;
    },
    uploadWasm(file){
      this.processUploadFile(file, (cid, buf)=>{
        this.wasm_file_cid = this.build_to_file_list(cid);
        this.res.wasm = cid;
        utils.cache.put('wasm_file_cid', cid);
        utils.cache.put('wasm_file_hash', utils.crypto.sha256(buf));
      });

      return false;
    },
    uploadWasmMainfest(file){
      this.processUploadFile(file, (cid, buf)=>{
        this.wasm_fest_file_cid = this.build_to_file_list(cid);
        this.res.wasm_fest = cid;
        utils.cache.put('wasm_fest_file_cid', cid);
        utils.cache.put('wasm_fest_file_hash', utils.crypto.sha256(buf));
      });
      return false;
    },
    processUploadFile(file, callback, encrypted=false){
      this.$root.loading(true);
      const fr = new FileReader();
      fr.onload = (e)=>{
        // const buf = (e.target.result.replace(`data:${file.type};base64,`, ''));
        let buf = e.target.result;

        if(encrypted){
          buf = utils.crypto.encode(buf);
        }

        // put to ipfs
        http.putToIpfs(buf).then((cid)=>{
          console.log('cid', cid);
          callback(cid, e.target.result);
          this.$root.loading(false);
        });
      };

      fr.readAsArrayBuffer(file);


      return false;
    },

    clickNext(){
      this.$router.push('/upload_task');
    },
    clickPrev(){
      this.$router.push('/');
    },
  }
}
</script>