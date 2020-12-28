<template>
<div class="tea-page">
  
  <div>
    <h2 style="color:#333;">Actions List</h2>
    <el-button round type="primary" @click="$router.push('/pair-with-mobile')">Pair with Mobile</el-button>
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