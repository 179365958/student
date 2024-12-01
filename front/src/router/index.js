import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout/index.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus' // Add this line

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/student/Student.vue'),
        meta: { title: '学生管理', roles: ['admin', 'teacher'] } // Add roles meta
      },
      {
        path: 'class',
        name: 'Class',
        component: () => import('@/views/class/Class.vue'),
        meta: { title: '班级管理', roles: ['admin', 'teacher'] } // Add roles meta
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 学生管理系统` : '学生管理系统'
  
  // 如果是登录页
  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  // 如果没有登录
  if (!userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 如果已登录但没有用户信息，尝试获取用户信息
  if (!userStore.userInfo) {
    try {
      await userStore.initUserInfo()
    } catch (error) {
      next('/login')
      return
    }
  }
  
  // 检查路由权限
  if (to.meta.roles && !to.meta.roles.includes(userStore.userRole)) {
    ElMessage.error('无权限访问该页面')
    next(from.path)
    return
  }
  
  next()
})

export default router