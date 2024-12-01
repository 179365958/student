import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '未知用户',
    userRole: (state) => state.userInfo?.role || 'guest'
  },

  actions: {
    async login(username, password) {
      try {
        const res = await loginApi({ username, password })
        const { token, ...userInfo } = res.data
        this.setToken(token)
        this.setUserInfo(userInfo)
        return res
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async initUserInfo() {
      if (!this.token) return null
      
      try {
        const res = await getUserInfoApi()
        this.setUserInfo(res.data)
        return res.data
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    clearAuth() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})