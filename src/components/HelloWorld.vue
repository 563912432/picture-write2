<template>
  <div class="hello">
    <v-header :url="info.topVideo"></v-header>
    <div class="content">
      <ul v-loading.body="loading">
        <li v-for="(item, index) in msg" :key="item.id"
            :class="[index % 2 === 0?'white':'orange']"
            :title="item.title"
            @click="click(item.id)">
          <i class="el-icon-arrow-right" :class="[index % 2 === 0?'i-orange':'i-white']" style="font-weight: bold;"></i>
          <span class="space">{{ item.title }}</span>
        </li>
      </ul>
      <!--顶图广告位-->
      <div class="img-container" v-if="info.adInfo && info.adInfo.thumb">
        <img :src="info.adInfo.thumb?host + 'Uploads/' + info.adInfo.thumb:''" alt="" @click="topAdClick(info.adInfo.type, info.adInfo.video_url, info.adInfo.content, 'top')">
      </div>
      <!--推荐广告位-->
      <div class="tuijian-container" v-if="info.adInfo && bottomAd[0] && bottomAd[0].thumb1 !== ''">
        <div class="tuijian-parent" v-for="(item, index) in bottomAd" :key="index">
          <div class="tuijian-image">
            <img :src="item.thumb1?host + 'Uploads/' +item.thumb1:''" alt="" @click="tuijianClick(item.bottom_type, item.contentActivity, item.top_href_video, index)">
          </div>
          <div class="tuijian-title">

            {{item.adTitle}}
          </div>
        </div>
        <div style="clear: both"></div>
      </div>
    </div>
    <!--logo-->
    <div v-if="info.adInfo && openSimple && info.adInfo.logo" class="logo">
      <div class='b-button' @click="topAdClick(info.adInfo.type, info.adInfo.video_url, info.adInfo.content, 'logo')">
        <img :src="host + 'Uploads/' +info.adInfo.logo" alt="">
      </div>
      <div class="btnClose" @click="bClose">X</div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import footer from '@/components/footer'
import header from '@/components/header'
import {mapState} from 'vuex'

const Host = '/Api/Pinyin/'

export default {
  name: 'HelloWorld',
  components: {
    'v-footer': footer,
    'v-header': header
  },
  computed: {
    timeNow () {
      return Date.parse(new Date())
    },
    ...mapState(['adCate', 'adType'])
  },
  data () {
    return {
      host: '/',
      cardId: '', // 卡片id
      uid: '', // 用户标识
      info: {
        topAdUrl: '',
        adInfo: {
          thumb: '',
          logo: '',
          content: '',
          ad: ''
        }
      }, // 全部信息
      msg: '',
      bottomAd: [],
      isParent: true,
      loading: false,
      openSimple: false
    }
  },
  mounted () {
    this.loading = true
    // 取cookie
    this.openSimple = !this.$cookie.get('spw')
    let url = Host + 'pictureWriting2'
    this.post(url, '', res => {
      this.loading = false
      if (res.status) {
        this.info = res.info
        this.cardId = this.info.card_id
        // 取localStorage
        let uid = window.localStorage.getItem('user')
        if (uid) {
          this.uid = uid
        } else {
          this.uid = this.info.uid
          window.localStorage.setItem('user', this.uid)
        }
        if (res.info.adInfo && res.info.adInfo.content) {
          this.$store.commit('saveTopContent', res.info.adInfo.content)
        }
        if (res.info.tree) {
          this.msg = res.info.tree
        }
        if (res.info.adInfo && res.info.adInfo.ad) {
          this.bottomAd = JSON.parse(res.info.adInfo.ad)
        }
      } else {
        console.log(res.info)
      }
    })
  },
  methods: {
    // logo的点击事件
    topAdClick (type, hrefVideo, content, tag) {
      switch (parseInt(type)) {
        case 1: // 链接网址
          window.location.href = hrefVideo
          break
        case 2: // 视频代码
          this.$router.push(`/introduce/${hrefVideo}`)
          break
        case 3: // 活动详情
          this.$store.commit('saveTopContent', content)
          this.$router.push(`adDetail/${this.adCate.topAd}`)
          break
        default:
          break
      }
      let formdata = new FormData()
      formdata.append('cardId', this.cardId)
      formdata.append('uid', this.uid)
      if (tag === 'logo') { // logo统计
        formdata.append('tag', this.adType.logo)
      }
      if (tag === 'top') { // top统计
        formdata.append('tag', this.adType.top)
      }
      this.post(`${Host}adStatistic`, formdata, res => {
        console.log(res.info)
      })
    },
    tuijianClick (type, content, hrefVideo, index) {
      switch (parseInt(type)) {
        case 1: // 链接地址
          window.location.href = hrefVideo
          break
        case 2: // 活动详情
          this.$store.commit('saveTuiJianContent', content)
          this.$router.push(`adDetail/${this.adCate.tuijianAd}`)
          break
        default:
          break
      }
      let url = Host + 'adStatistic'
      let formdata = new FormData()
      formdata.append('cardId', this.cardId)
      formdata.append('uid', this.uid)
      let tag = 'bottom' + (index + 1)
      switch (tag) {
        case 'bottom1':
          tag = this.adType.bottom1
          break
        case 'bottom2':
          tag = this.adType.bottom2
          break
        case 'bottom3':
          tag = this.adType.bottom3
          break
        case 'bottom4':
          tag = this.adType.bottom4
          break
      }
      formdata.append('tag', tag)
      this.post(url, formdata, res => {
        console.log(res.info)
      })
    },
    timeTo13 (number10) {
      return parseInt(number10 + '000')
    },
    timeStringToStamp (string) {
      return (new Date(Date.parse(string.replace(/-/g, '/')))).getTime()
    },
    post (url, data, fn) { // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
      let obj = new XMLHttpRequest()
      obj.open('POST', url, true)
      obj.onreadystatechange = function () {
        if (+obj.readyState === 4 && (+obj.status === 200 || +obj.status === 304 || +obj.status === 0)) { // 304未修改
          fn.call(this, JSON.parse(obj.responseText))
        }
      }
      obj.send(data)
    },
    click (el) {
      this.$router.push({path: '/d/' + el})
    },
    bClose () {
      this.openSimple = false
      this.$cookie.set('spw', 'Helloworld', parseInt(this.info.adInfo.interval))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  li {
    list-style-type: none;
  }
  .hello {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .logo{
    width: 70px;
    height: 75px;
    position: fixed;
    background-color: transparent;
    right: 0;
    bottom: 10%;
    z-index: 10;
  }
  .logo .b-button{
    width: 50px;
    height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    border: solid 1px #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
  }
  .logo .btnClose{
    width: 20px;
    height: 20px;
    line-height:20px;
    margin:5px auto 0;
    text-align:center;
    color: #FF0000;
    border-radius:50%;
    border: solid 1px #FF0000
  }

  .hello .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 0;
    color: #000507;
  }

  .hello .content ul {
    margin: 0;
    padding: 0;
  }

  .hello .content ul li {
    padding: 10px;
  }

  .hello .content .white {
    background-color: #fff;
    margin: 3px;
    border-radius: 3px;
  }

  .hello .content .orange {
    background-color: #f7dab5;
    margin: 3px;
    border-radius: 3px;
  }
  .hello .content .i-orange{
    color: #b2721f
  }
  .hello .content .i-white{
    color: #fff;
  }
  .hello .img-container {
    width: 100%;
    height: auto;
    text-align: center;
    align-self: center;
    background-color: transparent;
    margin-top: 15px;
  }

  .hello .img-container img {
    width: 100%;
    height: 100%;
  }
  .hello .tuijian-container {
    margin-top: 15px;
    width: 100%;
    text-align: center;
    background-color: transparent;
  }
  .hello .tuijian-container .tuijian-parent{
    float: left;
    box-sizing: border-box;
    width: 45.5%;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 3%;
    height: auto;
    background-color: #ffffff;
    display: flex;
    display: -webkit-flex;
    display: -webkit-box;
    display: -ms-flexbox;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    /*align-items: center;*/
    justify-content: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    border-radius: 10px;
    padding: 10px;
  }
  .tuijian-title{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
    height: 40px;
    margin-top: 5px;
    text-align: left;
  }
  .hello .tuijian-container .tuijian-parent:nth-child(2n){
    margin-left: 0;
  }
  /*.hello .tuijian-container .tuijian-parent:nth-child(3){*/
  /*padding: 0 1px 2px 2px;*/
  /*}*/
  /*.hello .tuijian-container .tuijian-parent:nth-child(4){*/
  /*padding: 0 2px 2px 1px;*/
  /*}*/
  .hello .tuijian-container .tuijian-image img {
    width: 100%;
    height: 100%;
  }
</style>
