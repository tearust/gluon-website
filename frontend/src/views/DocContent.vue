<template>
<div class="c-page c-page1" ref="page">

  <section class="t-md" v-if="html" v-html="html"></section>
  
</div>  
</template>
<script>
import util from '../util';
import _ from 'lodash';
import request from '../request';
export default {
  data(){
    return {
      html: null
    };
  },
  beforeRouteUpdate(to, from, next){
    // console.log(to, from, next)
    _.delay(async ()=>{
      await this.update(to);

    }, 100);

    // jump to link point
    _.delay(()=>{
      this.jumpToLinkPoint(to);
    }, 1000);

    next();
  },

  async mounted(){
    await this.update(this.$route);

    _.delay(()=>{
      $('.js_footer').show();
    }, 200);
    _.delay(this.initBind, 2000);

    _.delay(()=>{
      this.jumpToLinkPoint(this.$route);
    }, 1000);
  },
  methods: {
    jumpToLinkPoint(route){
      const name = route.hash;
      if(!name) return false;
      
      this.$nextTick(()=>{
        const el = $(name);
        if(el.length < 1) return false;
        let top = $(name).offset().top;
        if(top > 120) top = top - 120;
        console.log('jump to '+top);
        
        $('html').scrollTop(top);
        
      });
      

    },

    initBind(){
      const el = $(this.$el);
      el.on('click', '.js_click_md', (e)=>{
        const file = $(e.target).attr('href');
        const path = decodeURIComponent(this.$route.path);
        

        const t1 = file.split('/');
        const t2 = path.split('/');
        t2.shift();
        t2.shift();
        t2.unshift("");
        t2.pop();

        _.each(t1, (t)=>{
          if(t === '..'){
            t2.pop();
          }
          else if(t === '.'){

          }
          else{
            t2.push(t);
          }
        });
        const tar = t2.join('/');

        
        this.$router.push('/doc_list/'+encodeURIComponent(tar));

        return false;
      })
    },
    async update(route){
      this.$root.loading(true);

      const md = await request.get_doc_content(route.params.doc_path);
      if(md){
        this.html = util.mdToHtml(md);
      }

      $('html')[0].scrollTop = 0;

      this.$root.loading(false);
    }
  }
}
</script>
<style lang="scss">
.t-md{

  h1{
    font-size: 32px;
    color: #000;
    margin-bottom: 40px;
    margin-top: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eaecef;
    font-weight: bold;
  }

  h2{
    font-size: 26px;
    color: #333;
    margin: 30px 0 10px;
    font-weight: bold;
  }

  h3{
    font-size: 22px;
    color: #333;
    margin: 20px 0 10px;
    font-weight: bold;
  }

  h4{
    font-size: 20px;
    color: #333;
    margin: 12px 0 8px;
  }

  p{
    font-size: 16px;
    color: #555;
    margin: 8px 20px;
  }

  ul{
    li{
      list-style: circle;
      font-size: 16px;
      color: #555;
      margin: 8px 10px;
    }
  }

  pre{
    padding: 12px 15px;
    background: #f3f3f3;
    white-space: normal;
    code{
      
    }
  }

  img{
    max-width: 100%;
    margin:20px 8px;
  }
}

@media screen and (max-width : 600px) {
  .c-page1{
    padding: 0 !important;
  }
}
</style>