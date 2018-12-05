<template>
  <div class="hello">
    <v-header></v-header>
    <div class="content" v-loading.body="loading">
      <div class="menu">
        <span>
          <router-link to="/" class='menu-title1' style="color: #fff;text-decoration: none">
            <span class="menu-title"><img src="../assets/back.png" alt="返回"> 返回</span>
          </router-link>
        </span>
      </div>
      <div class="cdcontent" v-html="text"></div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import footer from '@/components/footer'
import header from '@/components/header'
import {mapState, mapGetters} from 'vuex'
//  const Host = 'http://www.meili.com/'
export default {
  name: 'adDetail',
  components: {
    'v-footer': footer,
    'v-header': header
  },
  computed: {
    ...mapState(['adCate']),
    ...mapGetters(['topContent', 'tuiJianContent'])
  },
  data () {
    return {
      loading: false,
      text: ''
    }
  },
  created () {
    // 判断拿过来的参数
    switch (parseInt(this.$route.params.type)) {
      case this.adCate.topAd:
        this.text = this.topContent
          .replace(this.topContent ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '\'')
          .replace(/&#39;/g, '\'')
        //  .replace(/\/Uploads/g, Host + 'Uploads')
        break
      case this.adCate.tuijianAd:
        this.text = this.tuiJianContent
          .replace(this.tuiJianContent ? /&(?!#?\w+;)/g : /&/g, '&amp;')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '\'')
          .replace(/&#39;/g, '\'')
        //  .replace(/\/Uploads/g, Host + 'Uploads')
        break
      default:
        this.text = '暂无内容！'
        break
    }
  },
  methods: {
    handleFormat (string) {
      string.replace(string ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '\'')
        .replace(/&#39;/g, '\'')
    }
    // get (url, fn) { // XMLHttpRequest对象用于在后台与服务器交换数据
    //   let xhr = new XMLHttpRequest()
    //   xhr.open('GET', url, true)
    //   xhr.onreadystatechange = function () {
    //     if (+xhr.readyState === 4 && (+xhr.status === 200 || +xhr.status === 304 || +xhr.status === 0)) { // readyState == 4说明请求已完成
    //       fn.call(this, xhr.responseText) // 从服务器获得数据
    //     }
    //   }
    //   xhr.send()
    // }
  }
}
</script>

<style>
  .hello .content .cdcontent img{
    width: 100%;
  }
  .hello .content .cdcontent p{
    margin: 0;
    padding: 0;
  }
</style>
<style scoped>
  .hello {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .hello .content{
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .hello .content .menu{
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 13px;
    color: #fff;
    background-color: #fcac43;
    z-index: 1;
  }

  .hello .content .menu .menu-title1 img{
    width: 13px;
    height: 13px;
    margin-bottom: -1px;
  }

  .hello .content .cdcontent {
    box-sizing: border-box;
    width: 100%;
    background-color: #ffffff;
    flex: 1;
    padding: 10px;
    z-index: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
