<template>
  
<div>

  <el-upload
    style="text-align:left;"
    action="/"
    :accept="accept"
    :on-change="fileChangeHandler"
    :before-upload="upload"
    :file-list="file_list?[file_list]:[]">
    <el-button size="small" type="primary">{{text}}</el-button>
    <div slot="tip" class="el-upload__tip">{{tip}}</div>
  </el-upload>


</div>

</template>
<script>
import utils from '../tea/utils';
import http from '../tea/http';
export default {
  data(){
    return {
      cid: null,
      file_list: null,
    };
  },
  props: {
    accept: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    tip: {
      type: String,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    }

  },
  methods: {
    fileChangeHandler(){},
    build_to_file_list(cid){
      return {
        name: cid,
        url: cid
      };
    },
    upload(file){
      this.processUploadFile(file, (cid, buf)=>{
        this.file_list = this.build_to_file_list(cid);
        this.cid = cid;
      
        this.onChange(this.cid);
      }, false);
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
  }
}
</script>