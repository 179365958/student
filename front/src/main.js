import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from './stores/user' // 引入用户状态管理

const app = createApp(App) // 创建 Vue 应用实例
const pinia = createPinia() // 创建 Pinia 实例用于状态管理

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component) // 将每个图标组件注册到应用中
}

app.use(pinia) // 使用 Pinia 插件

const userStore = useUserStore() // 获取用户状态管理实例
userStore.checkAuth() // 在应用启动时检查用户认证状态

app.use(router) // 使用路由插件
app.use(ElementPlus) // 使用 Element Plus UI 组件库

app.mount('#app') // 挂载应用到 DOM 中的 #app 元素