<template>
<div class="tea-page">
  <DeployDataTaskStep :step="3" />

  <h4>Session ID: {{session_id}}</h4>
  <h4>Deployment ID: {{deployment_id}}</h4>

  <div style="display:flex;">
    <el-button type="primary" style="width:150px;"  
      @click="find_provider()">Find provider</el-button>

    <el-button style="width:100px; margin-left: 50px;" 
    type="primary" 
    @click="refresh()">Refresh</el-button>
  </div>

  <h4 v-if="deployment_id">Peers List <font v-if="loading" style="font-size:14px;color:#9c9c9c;margin-left: 15px;">querying...</font></h4>
  <h5 v-for="(addr, i) in peers_list" :key="i">{{addr}}</h5>
  
</div>
</template>
<script>
import DeployHelper from '../workflow/DeployHelper';
import DeployDataTaskStep from './DeployDataTaskStep';
import _ from 'lodash';
import PubSub from 'pubsub-js';
export default {
  components: {
    DeployDataTaskStep
  },
  data(){
    return {
      session_id: null,
      deployment_id: null,
      peers_list: null,
      loading: true,
    };
  },
  async mounted(){
    this.session_id = this.$route.params.sesson_id;
    DeployHelper.queryTaskResult(this.session_id, (step, res)=>{
      if(step === 1){
        this.deployment_id = res.deployment_id;
      }

      if(step === 3){
        this.peers_list = res.peers;
      }
      if(step === 4){
        this.loading = false;
      }
    });
  },
  methods: {
    async find_provider(){
      PubSub.publish('test-btn-a', {});
    },
    async refresh(){
      PubSub.publish('test-btn-b', {});
    }
  }
}
</script>