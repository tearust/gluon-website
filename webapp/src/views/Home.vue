<template>
<div class="tea-page">
  
  <div>
    <h2 style="color:#333;">Actions List</h2>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Create BTC Keypair" name="1">
        <div>Coming soon</div>
        <div>action</div>
      </el-collapse-item>

      <el-collapse-item title="Transfer BTC" name="2">
        <div>Coming soon</div>
        <div>action</div>
      </el-collapse-item>

      <el-collapse-item title="Recovery Keypair" name="3">
        <div>Coming soon</div>
        <div>action</div>
      </el-collapse-item>
      
    </el-collapse>
  </div>





</div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: []
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
}
</script>