import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout/index.vue'
import { useUserStore } from '@/stores/user'

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘' }
      }
    ]
  },
  {
    path: '/class',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Class',
        component: () => import('@/views/class/Class.vue'),
        meta: { title: '班级管理' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Student',
        component: () => import('@/views/student/Student.vue'),
        meta: { title: '学生管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  
  // 如果有 token 但没有用户信息，尝试恢复用户信息
  if (token && !userStore.userInfo) {
    userStore.initUserInfo()
  }
  
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  if (!token) {
    next('/login')
    return
  }
  
  next()
})

export default router 