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
        @select="handleMenuClick"
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
          <el-dropdown class="avatar-container" @command="handleCommand">
            <span class="avatar-wrapper">
              <el-avatar :size="30" icon="UserFilled" />
              <span class="user-name">{{ userStore.username }}</span>
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容 -->
      <el-main>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </el-main>
    </el-container>
  </el-container>

  <!-- 修改密码对话框 -->
  <ChangePassword ref="changePasswordRef" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataLine,
  User,
  Collection,
  Calendar,
  Document,
  Fold,
  Expand,
  ArrowDown,
  CaretBottom
} from '@element-plus/icons-vue'
import ChangePassword from '@/components/ChangePassword.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)
const changePasswordRef = ref(null)

// 获取用户名的计算属性
const username = computed(() => {
  return userStore.userInfo?.username || '未知用户'
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'changePassword':
      changePasswordRef.value?.show()
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await userStore.clearAuth()
        ElMessage.success('已退出登录')
        await router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        ElMessage.error('退出失败，请重试')
      }
      break
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}

// 添加路由变化监听
watch(() => route.path, (newPath) => {
  console.log('路由变化:', newPath)
})

// 添加菜单点击事件处理
const handleMenuClick = (index) => {
  console.log('菜单点击:', index)
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