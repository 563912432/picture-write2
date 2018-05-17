<template>
  <div class="hello">
    <v-header></v-header>
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
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import footer from '@/components/footer'
import header from '@/components/header'

const Host = 'http://192.168.1.17/Api/Pinyin/'

export default {
  name: 'HelloWorld',
  components: {
    'v-footer': footer,
    'v-header': header
  },
  data () {
    return {
      msg: '',
      isParent: true,
      loading: false
    }
  },
  mounted () {
    this.loading = true
    let url = Host + 'pictureWriting2'
    this.post(url, '', res => {
      this.loading = false
      if (res.status) {
        this.msg = res.info
      } else {
        console.log(res.info)
      }
    })
  },
  methods: {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    flex: 1;
    display: flex;
    flex-direction: column;
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
</style>
