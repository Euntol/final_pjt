import router from '@/router'
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const API_URL = 'http://127.0.0.1:8000'

export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    communityArticles: [],
    username: null,
    token: null,
  },
  getters: {
    getUserToken(state) {
      return state.token
    },
    getUserName(state) {
      return state.username
    }
  },
  mutations: {
    CREATE_COMMUNITY_ARTICLE(state, data) {
      state.communityArticles.push(data)
    },
    DELETE_COMMUNITY_ARTICLE(state, data) {
      const index = state.communityArticles.indexOf(data)
      state.communityArticles.splice(index, 1)
    },
    SAVE_USERNAME(state, username) {
      state.username = username
    },
    SAVE_TOKEN(state, token) {
      state.token = token
      router.push({ name: 'Community' })
    },
    LOGOUT(state) {
      state.token = null;
      state.username = null;
    }
  },
  actions: {
    createCommunityArticle(context, data) {
      context.commit('CREATE_COMMUNITY_ARTICLE', data)
    },
    deleteCommunityArticle(context, data) {
      context.commit('DELETE_COMMUNITY_ARTICLE', data)
    },
    // 회원가입
    signUp(context, payload) {
      const username = payload.username
      axios({
        method: 'post',
        url: `${API_URL}/accounts/signup/`,
        data: {
          username: payload.username,
          password1: payload.password1,
          password2: payload.password2,
        }
      })
        .then((res) => {
          console.log(res.data.key)
          context.commit('SAVE_USERNAME', username)
          context.commit('SAVE_TOKEN', res.data.key)
        })
        .catch(() => {
          console.log('에러입니다')
        })
    },
    // 로그인
    logIn(context, payload) {
      const username = payload.username
      axios({
        method: 'post',
        url: `${API_URL}/accounts/login/`,
        data: {
          username: payload.username,
          password: payload.password,
        }
      })
        .then((res) => {
          console.log(username)
          context.commit('SAVE_USERNAME', username)
          context.commit('SAVE_TOKEN', res.data.key)
        })
    },
    // 로그아웃
    logOut({ commit }) {
      commit('LOGOUT')
    }
  },
  modules: {
  }
})
