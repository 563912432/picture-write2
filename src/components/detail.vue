<template>
    <div class="detail" v-loading.body="loading">
      <div class="back" @click="close"><i class="el-icon-error" style="color: #ffffff;font-size: 30px"></i></div>
      <span ref="button" class="play">
        <span v-if="isPlay" @click="play">
          <img src="../assets/pause.png" style="width: 15px;height: 15px;margin-bottom: -2px" alt="暂停"> 暂停
        </span>
        <span v-else @click="play">
          <img src="../assets/play.png" style="width: 15px;height: 15px;margin-bottom: -2px" alt="播放"> 播放
        </span>
      </span>
      <div class="img">
        <img :src="host + 'Uploads/'+ img" alt="" @click="zoomIn" id="img">
      </div>
      <audio ref="audio" class="audio"></audio>
    </div>
</template>

<script>
export default {
  name: 'd',
  data () {
    return {
      host: 'http://192.168.1.17/',
      cid: '',
      loading: false,
      img: null,
      zoom: false,
      isPlay: false,
      currentMp3: ''
    }
  },
  mounted () {
    this.loading = true
    let formdata = new FormData()
    formdata.append('id', this.$route.params.id)
    let url = this.host + 'Api/Pinyin/cardDetail'
    this.post(url, formdata, res => {
      if (res.status) {
        this.cid = res.info.cid
        this.img = res.info.thumb
        this.currentMp3 = res.info.mp3
        this.loading = false
      }
    })
  },
  destroyed () {
    this.isPlay = false
  },
  watch: {
    currentMp3 () {
      if (!this.isIOS()) {
        this.$refs.button.childNodes[0].click()
      }
    }
  },
  methods: {
    // 音频播放器初始化
    createAudio () {
      if (!this.audio) {
        this.$refs.audio.setAttribute('controls', 'controls')
        this.audio = this.$refs.audio
        this.audio.addEventListener('ended', () => {
          this.isPlay = false
          this.$refs.audio.removeAttribute('controls')
        })
      }
      this.audio.src = this.host + 'Uploads/Mp3/' + this.currentMp3
    },
    play () {
      if (!this.audio) {
        this.createAudio()
      }
      if (!this.isPlay) {
        this.audio.play()
        this.isPlay = true
        this.$refs.audio.setAttribute('controls', 'controls')
      } else {
        this.audio.pause()
        this.isPlay = false
      }
    },
    post (url, data, fn) {
      let obj = new XMLHttpRequest()
      obj.open('POST', url, true)
      obj.onreadystatechange = function () {
        if (+obj.readyState === 4 && (+obj.status === 200 || +obj.status === 304 || obj.status === 0)) {
          fn.call(this, JSON.parse(obj.responseText))
        }
      }
      obj.send(data)
    },
    close () {
      this.$router.push({path: '/'})
    },
    zoomIn (e) {
      if (this.zoom) {
        e.target.style.width = '100%'
        this.zoom = false
      } else {
        e.target.style.width = '150%'
        this.zoom = true
      }
    },
    isIOS () {
      let userAgent = navigator.userAgent
      return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }
  }
}
</script>

<style scoped>
  .detail {
    flex: 1;
    background-color: #ffffff;
    display: flex;
    z-index: 0;
  }
  .detail .back{
    background-color: #b2721f;
    border-radius: 20px;
    position: fixed;
    left: 10px;
    top: 10px;
    padding: 1px;
    z-index: 1;
  }
  .detail .play{
    background-color: #b2721f;
    border-radius: 3px;
    position: fixed;
    right: 10px;
    top: 10px;
    padding: 5px 10px;
    z-index: 1;
    color: #fff;
    font-size: 15px;
  }
  .detail .audio{
    position: fixed;
    bottom:0;
    width: 100%;
    z-index: 10;
  }
  .detail .img{
    position: relative;
    width: 100%;
    height: 90%;
  }
  .detail .img img{
    width: 100%;
    height: auto;
  }
</style>
