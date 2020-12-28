<template>
<section class="t-footer bg_2 js_footer">
  <div class="c-m" style="width:960px;margin:0 auto;">

    <el-row>
      <el-col :span="6">
        <h4 class="t-h">Resources</h4>
        <a class="t-a" target="_blank" href="http://tearust.com">Tearust</a>
        <!-- <a class="t-a" target="_blank" href="https://medium.com/@pushbar">Medium</a> -->
        <!-- <a class="t-a" target="_blank" href="https://github.com/tearust/tea-docs/discussions">Discussions</a> -->
        
      </el-col>
      <el-col :span="12">
        <!-- <h4 class="t-h">Contact</h4> -->
        <!-- <span class="t-a">Email: </span> -->
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <p style="margin:0 auto;text-align:center;font-size:16px;">Copyright © 2019-2020 <b>Gluon-Wallet</b> All Rights Reserved</p>
  </div>
</section>

</template>
<style lang="scss">
.t-footer{
  padding: 24px 0 40px;
  // position: fixed;
  // width: 100%;
  // bottom: 0;
  background: rgb(53, 166, 150);

  *{
    color: #fff;
  }

  .t-h{
    margin: 0 0 20px 0;
    text-align: left;
    font-size: 21px;
  }
  .t-a{
    font-size: 19px;
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