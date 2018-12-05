import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    adCate: {
      topAd: 1,
      tuijianAd: 2
    },
    adType: {
      logo: 1,
      top: 2,
      bottom1: 3,
      bottom2: 4,
      bottom3: 5,
      bottom4: 6
    },
    // 顶层广告位的内容
    topContent: '',
    // 推荐广告位的内容
    tuiJianContent: ''
  },
  getters: {
    // 获取顶层广告位内容
    topContent (state) {
      return state.topContent
    },
    // 获取推荐广告位内容
    tuiJianContent (state) {
      return state.tuiJianContent
    }
  },
  mutations: {
    // 保存顶层广告位内容
    saveTopContent (state, data) {
      state.topContent = data
    },
    // 保存推荐广告位内容
    saveTuiJianContent (state, data) {
      state.tuiJianContent = data
    }
  }
})
export default store
