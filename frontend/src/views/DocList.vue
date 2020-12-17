<template>
<div class="c-page">

  <el-row>
    <el-col :span="5" :xs="24">
      <ul class="t-ul" v-if="list">
        <li v-for="(item, i) in list" :key="i">
          <el-link v-if="!item.children" 
            type="primary" 
            :class="['fc_3', {'selected':cur_path===item.path}]" 
            @click="goto_content(item)">
            {{item.name}}
          </el-link>

          <div class="t-div" v-if="item.children">
            <!-- <span>{{item.name}}</span> -->
            <a href="javascript:void(0)" 
              :class="['span', {'selected':cur_path===item.path}]" 
              @click="goto_content(item)">{{item.name}}</a>

            <a href="javascript:void(0)" 
              v-for="(x, j) in item.children" :key="j" 
              type="primary" 
              :class="['fc_3', 't-lk', {'selected':cur_path===x.path}]" 
              @click="goto_content(x)">{{x.name}}</a>
          </div>
        </li>
      </ul>
    </el-col>

    <el-col class="m-21" :span="19" :xs="24">
      <router-view></router-view>
    </el-col>
  </el-row>
  


</div>  
</template>
<script>
import request from '../request';
import _ from 'lodash';
export default {
  data(){
    return {
      list: null,
      cur_path: null
    }
  },
  beforeRouteUpdate(to, from, next){
    this.cur_path = to.params.doc_path;

    if(!this.cur_path){
      this.default_to_first();
    }

    next();
  },
  created(){
    $('.js_footer').hide();
  },
  async mounted(){
    this.cur_path = this.$route.params.doc_path;
    
    this.$root.loading(true);

    const tmp_list = await request.get_doc_list();
    let list = [];
    _.each(tmp_list, (item)=>{
      list.push(item);
    })
  
    this.list = list;
    this.$root.loading(false);

    if(!this.cur_path){
      this.default_to_first();
    }

  },
  methods: {
    goto_content(item){
      this.$router.push('/doc_list/'+encodeURIComponent(item.path));
    },
    default_to_first(){
      let x = this.list[0];

      // if(x.children){
      //   x = x.children[0];
      // }

      this.goto_content(x);
    }
  }
}
</script>
<style lang="scss" scoped>
.m-21{
  padding-left: 20px;
}
.t-ul{
  // background:#f9f9f9; 
  min-height: 200px;
  list-style:none;
  padding: 24px 0 80px;

  *{
    font-family: sans-serif !important;
  }

  li{
    margin: 0;
    padding: 5px 0;
    border-bottom: 1px solid #e9e9e9;
    
    .el-link.el-link--primary{
      font-size: 15px;
      &.selected{
        color: #ec7259;
      }
      &:hover{
        color: #ec7259;
      }
    }
    .el-link.is-underline:hover:after{
      border-bottom: 1px solid #ec7259;
    }
    .t-div{
      .span{
        font-size: 16px;
        display: table;
        color: #35a6a6;
        font-weight: bold;

        &.selected{
          color: #ec7259;
        }
        &:hover{
          border-bottom: 1px solid #ec7259;
          color: #ec7259;
        }
      }
      a.t-lk{
        font-size: 15px;
        margin-left: 30px;
        display: table;
        text-indent: -15px;
        &.selected{
          color: #ec7259;
        }
        &:hover{
          // border-bottom: 1px solid #ec7259;
          text-decoration: underline;
          color: #ec7259;
        }
      }
    }
  }
}
@media screen and (max-width : 600px) {
  .m-21{
    padding-left: 0 !important;
  }
}
</style>