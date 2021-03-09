<template>
<div class="c-page">
  <h4>Admin Login</h4>
  <el-form :model="form" label-width="100px" style="margin-top: 40px;">
    <el-form-item label="Username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="Password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
  </el-form>

  <div style="text-align:right;">
    <el-button @click="loginHandler()" style="width: 180px;" type="primary">Login</el-button>
  </div>
  
</div>
</template>
<script>
import request from '../request';
export default {
  data(){
    return {
      form: {
        username: '',
        password: '',
      }
    };
  },
  methods: {
    async loginHandler(){

      try{
        this.$root.loading(true);
        await request.admin_login(this.form.username, this.form.password);
        _.delay(()=>{

          this.$root.loading(false);
          location.reload();
        }, 1000);
        
      }catch(e){
        this.$root.loading(false);
        this.$root.toast(e.error, 'error');
      }
    }
  }
}
</script>