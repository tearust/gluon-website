<template>

<el-steps :active="step" style="margin: 10px 0 30px;">
  <el-step title="Select" description=""></el-step>
  <el-step :title="title" description=""></el-step>
  <el-step title="Result" description=""></el-step>
</el-steps>

</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  props: {
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: 'Upload Data'
    }
  }
}
</script>