import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    userInfo: null,
    token: null
  }),
  actions: {
    setUserInfo(data) {
      this.userInfo = data.user
      this.token = data.token
      this.isAuthenticated = true
      
      // 保存认证信息
      if (data.remember) {
        // 如果选择记住密码，保存到 localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.user))
        localStorage.setItem('rememberPassword', 'true') // 保存记住密码的状态
      } else {
        // 如果不记住密码，保存到 sessionStorage
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('userInfo', JSON.stringify(data.user))
        localStorage.removeItem('rememberPassword') // 清除记住密码的状态
      }
    },
    checkAuth() {
      // 优先检查 sessionStorage
      let token = sessionStorage.getItem('token')
      let userInfo = sessionStorage.getItem('userInfo')
      
      // 如果 sessionStorage 没有，再检查 localStorage
      if (!token || !userInfo) {
        token = localStorage.getItem('token')
        userInfo = localStorage.getItem('userInfo')
      }

      if (token && userInfo) {
        this.token = token
        this.userInfo = JSON.parse(userInfo)
        this.isAuthenticated = true
      } else {
        this.clearAuth()
      }
    },
    clearAuth() {
      this.isAuthenticated = false
      this.userInfo = null
      this.token = null
      
      // 清除认证信息
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      // 不清除记住密码相关的信息
      // 如果之前选择了记住密码，保留这些信息
      if (!localStorage.getItem('rememberPassword')) {
        localStorage.removeItem('remembered_username')
        localStorage.removeItem('remembered_password')
      }
    }
  }
}) 