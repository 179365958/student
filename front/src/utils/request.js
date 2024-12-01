import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log('Request:', config)  // 添加调试日志
    const userStore = useUserStore()
    // 如果有 token 就带上
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('Response data:', res)  // 添加调试日志
    
    if (!res.success) {
      console.error('Request failed:', res.message)  // 添加错误日志
      ElMessage({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || '错误'))
    }
    return res
  },
  error => {
    console.error('Request error:', error.response?.data || error)  // 添加详细错误日志
    const userStore = useUserStore()
    
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      userStore.clearAuth()
      router.push('/login')
      ElMessage({
        message: error.response.data?.message || '登录已过期，请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      ElMessage({
        message: error.response?.data?.message || error.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service