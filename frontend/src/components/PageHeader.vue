<template>
<div class="c-m1">
  
<el-menu :default-active="activeIndex" active-text-color="#35a696" class="p-header" mode="horizontal" @select="handleSelect">
  <a href="javascript:void(0)" @click="$router.replace('/'); activeIndex='1';" style="float:left;">
    <el-image
      src="/img/logo.png"
      fit="fit">
    </el-image>
    
    <b class="lg">GLUON WALLET</b>
    
  </a>
  

  <!-- <el-menu-item @click="changeLang()">{{$t('nav.001')}}</el-menu-item> -->
  <el-menu-item style="display:none;" index="1">{{$t('nav.test')}}</el-menu-item>
  
  <!-- <el-menu-item index="/doc_list/Try_the_demo%2FREADME.md">{{$t('nav.002')}}</el-menu-item> -->
  <el-menu-item index="/doc_list">{{$t('nav.003')}}</el-menu-item>
  <el-menu-item index="/white_paper">{{$t('nav.005')}}</el-menu-item>

  <el-menu-item index="/">{{'Home'}}</el-menu-item>

  <li class="m-icon" @click="openDrawer()"><i class="el-icon-s-grid"></i></li>
</el-menu>


<el-drawer
  title=""
  custom-class="m-drawer"
  append-to-body
  size="60%"
  :modal="false"
  :visible.sync="drawer"
  direction="rtl"
>
  <a href="javascript:void(0)" @click="clickDrawerMenu('/')">{{'Home'}}</a>
  <a href="javascript:void(0)" @click="clickDrawerMenu('/white_paper')">{{$t('nav.005')}}</a>
  <a href="javascript:void(0)" @click="clickDrawerMenu('/doc_list')">{{$t('nav.003')}}</a>
  <!-- <a href="javascript:void(0)" @click="clickDrawerMenu('/doc_list/Try_the_demo%2FREADME.md')">{{$t('nav.002')}}</a> -->

  

</el-drawer>
</div>


</template>
<script>
  export default {
    data() {
      return {
        activeIndex: null,

        drawer: false,
      };
    },
    watch: {
      '$route': {
        immediate: true,
        handler (to, from){
          let name = to.path;
          if(to.name === 'doc_content'){
            name = '/doc_list';
          }

          this.activeIndex = name;
        }
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        if(key === 'lang'){
          this.changeLang();
          return false;
        }
        this.$router.push(key);
      },
      clickDrawerMenu(key){
        this.handleSelect(key);
        this.drawer = false;
      },
      changeLang(){
        if(this.$i18n.locale === 'en'){
          window.changeLanguage('zh');
        }
        else{
          window.changeLanguage('en');
        }

      },
      openDrawer(){
        this.drawer = true;
      }
    },

  }
</script>
<style lang="scss">
.c-m1{
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
  max-width:1140px;
  margin: 0 auto;

  .el-image{
    width: 60px; 
    height: 60px;
  }

  .m-icon{
    display: none;
  }

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

@media screen and (max-width : 600px) {
  
  .p-header{
    padding: 5px 15px 5px;
    max-width: 100%;
    
    .el-image{
      width: 40px;
      height: 40px;
    }

    .m-icon{
      float: right;
      width: 40px;
      height: 40px;
      display: block;
      position: relative;

      i{
        font-size: 36px;
        position: absolute;
        right: 0;
        top: 5px;
      }
    }
  }

  .el-menu--horizontal > .el-menu-item{
    display: none;
  }
  .el-menu--horizontal > .el-submenu{
    display: none;
  
  }

  
}

.m-drawer{
  
  .el-drawer__header{
    margin: 0;
  }
  .el-drawer__body{
    padding: 0 20px;
  }
  a{
    display: block;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
}
</style>