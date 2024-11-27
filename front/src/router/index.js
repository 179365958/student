import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user' // 添加用户状态管理导入

// 定义应用的路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
    meta: {
      title: '学生管理系统 - 登录'
    }
  },
  {
    path: '/',
    component: () => import('../components/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('../views/student/Student.vue'),
        meta: { title: '学生管理', icon: 'user' }
      },
      {
        path: 'class',
        name: 'Class',
        component: () => import('../views/class/Class.vue'),
        meta: { title: '班级管理', icon: 'collection' }
      }
    ]
  },
  {
    path: '/init/db',
    name: 'DbInit',
    component: () => import('@/views/init/DbInit.vue'),
    meta: {
      title: '数据库初始化'
    }
  }
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 增强的路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  console.log('当前路由配置：', router.getRoutes())
  
  // 设置页面标题
  document.title = to.meta.title || '学生管理系统'
  
  // 检查是否需要登录权限
  if (to.path !== '/login' && to.path !== '/init/db') {
    // 如果用户未登录，重定向到登录页面
    if (!userStore.isAuthenticated) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router 