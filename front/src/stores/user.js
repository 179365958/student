import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null,
    savedUser: null
  }),
  getters: {
    username: (state) => state.userInfo?.username || '未知用户'
  },
  actions: {
    setUserInfo(data) {
      this.userInfo = data
      this.token = data.token
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    initUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
        this.token = this.userInfo.token
      }
    },
    setSavedUser(username, password) {
      this.savedUser = { username, password }
      localStorage.setItem('savedUser', JSON.stringify({ username, password }))
    },
    getSavedUser() {
      const savedUser = localStorage.getItem('savedUser')
      if (savedUser) {
        this.savedUser = JSON.parse(savedUser)
        return this.savedUser
      }
      return null
    },
    clearSavedUser() {
      this.savedUser = null
      localStorage.removeItem('savedUser')
    },
    clearAuth() {
      this.userInfo = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
}) 