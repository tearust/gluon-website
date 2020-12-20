<template>
<div class="c-pageheader">

<el-menu active-text-color="#35a696" class="p-header" mode="horizontal">
  <a href="javascript:void(0)" onClick="location.reload()" style="float:left;">
    <el-image
      style="width: 60px; height: 60px;"
      src="http://tearust.com/img/logo.png"
      fit="fit">
    </el-image>
    
    <b class="lg">GLUON-WALLET</b>
  </a>
  

  <el-menu-item>
    <a href="http://tearust.com/" target="_blank">WEBSITE</a>
  </el-menu-item>
  
</el-menu>
</div>
  

</template>
<style lang="scss">
.c-pageheader{
  position: sticky;
  top: 0;
  display: block;
  border-bottom: 1px solid #eee;
  background: #fff;
  z-index: 99;
  text-align: center;
}

.p-header{
  padding: 10px 0 0 0;
  margin: 0 auto;
  width: 960px;

  .lg{
    font-size: 20px;
    color: #333;
    position: relative;
    vertical-align: top;
    top: 20px;
    left: 10px;
  }
}
.el-menu--horizontal > .el-menu-item{
  float: right;
  
}
.el-menu--horizontal > .el-submenu{
  float: right;
  
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}
</style>