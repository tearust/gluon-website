<template>
  <router-view></router-view>
</template>
<script>
import request from '../request';
export default {
  data(){
    return {};
  },

  beforeRouteUpdate(to, from, next){
    if(to.name === 'admin'){
      // this.$router.push('/admin/list');
      this.checkLogin();
    }
    else{
      next();
    }
    
  },

  methods: {
    async checkLogin(){
      
      try{
        const user = await request.admin_check_login();
        this.$store.commit('set_admin', user);
        this.$router.push('/admin/list');
      }catch(e){
        this.$router.push('/admin/login');
      }
      
    }
  },

  async mounted(){
    await this.checkLogin();
  }
}
</script>