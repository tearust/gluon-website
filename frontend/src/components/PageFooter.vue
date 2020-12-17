<template>
<section class="t-footer bg_2 js_footer">
  <div class="c-m" style="background:rgb(53, 166,150)">

    <el-row>
      <el-col :span="6">
        <h4 class="t-h">Resources</h4>
        <a class="t-a" target="_blank" href="https://github.com/tearust">Github</a>
        <a class="t-a" target="_blank" href="https://medium.com/@pushbar">Medium</a>
        <!-- <a class="t-a" target="_blank" href="https://github.com/tearust/tea-docs/discussions">Discussions</a> -->
        
      </el-col>
      <el-col :span="12">
        <!-- <h4 class="t-h">Contact</h4> -->
        <!-- <span class="t-a">Email: </span> -->
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <p style="margin:0 auto;text-align:center;font-size:16px;">Copyright © 2019-2020 <b>TeaRust</b> All Rights Reserved</p>
  </div>
</section>

</template>
<style lang="scss">
.t-footer{
  padding: 24px 0 40px;

  *{
    color: #fff;
  }

  .t-h{
    margin: 0 0 20px 0;
  }
  .t-a{
    font-size: 18px;
    display: table;
    &:hover{
      color: #ec7259;
    }
  }
}
@media screen and (max-width : 600px) {
  .t-footer{
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>