<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo" :class="{ 'collapsed': isCollapse }">
        <h2 v-if="!isCollapse">学生管理系统</h2>
        <h2 v-else>系统</h2>
      </div>
      <el-menu
        :default-active="route.path"
        class="menu"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        :background-color="'#fff'"
        :text-color="'#303133'"
        :active-text-color="'#409EFF'"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/student">
          <el-icon><User /></el-icon>
          <template #title>学生管理</template>
        </el-menu-item>

        <el-menu-item index="/class">
          <el-icon><Collection /></el-icon>
          <template #title>班级管理</template>
        </el-menu-item>

        <el-menu-item index="/dashboard/attendance">
          <el-icon><Calendar /></el-icon>
          <template #title>考勤管理</template>
        </el-menu-item>

        <el-menu-item index="/dashboard/grades">
          <el-icon><Document /></el-icon>
          <template #title>成绩管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon 
            class="toggle-sidebar" 
            @click="toggleCollapse"
            :class="{ 'is-collapse': isCollapse }"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '仪表盘' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              {{ userStore.userInfo?.username || '未知用户' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  DataLine,
  User,
  Collection,
  Calendar,
  Document,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

// 可以添加一个计算属性来获取用户名
const username = computed(() => {
  return userStore.userInfo?.username || '未知用户'
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'logout':
      try {
        // 清除用户状态
        await userStore.clearAuth()
        // 提示用户
        ElMessage.success('已退出登录')
        // 跳转到登录页面
        await router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        ElMessage.error('退出失败，请重试')
      }
      break
    case 'profile':
      router.push('/dashboard/profile')
      break
    case 'settings':
      router.push('/dashboard/settings')
      break
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409EFF;
  color: #fff;
  transition: all 0.3s;
  overflow: hidden;
}

.logo.collapsed {
  padding: 0 10px;
}

.logo h2 {
  color: #fff;
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
  transition: all 0.3s;
}

.toggle-sidebar {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: transform 0.3s;
}

.toggle-sidebar.is-collapse {
  transform: rotate(180deg);
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  padding: 0 8px;
  height: 40px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

:deep(.el-menu) {
  border-right: none;
  padding: 6px;
}

:deep(.el-menu--collapse) {
  padding: 6px 0;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  color: #303133;
  margin: 4px;
  border-radius: 4px;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 4px;
  width: 24px;
  text-align: center;
}

:deep(.el-menu--collapse .el-menu-item) {
  margin: 4px 0;
}

/* 收缩时的图标样式 */
:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin: 0;
  width: 100%;
  text-align: center;
}

/* 收缩动画 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style> 