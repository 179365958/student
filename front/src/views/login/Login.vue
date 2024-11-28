<template>
  <div class="login">
    <el-card class="login-card">
      <div class="login-header">
        <h2>学生管理系统</h2>
        <p class="subtitle">请登录您的账号</p>
      </div>
      <el-form 
        :model="loginForm" 
        :rules="rules"
        ref="loginFormRef"
        label-position="top" 
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="remember-row">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <el-link type="primary">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            class="login-button"
            size="large"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="link-container">
        <el-link type="primary" @click="goToInit">
          <el-icon class="link-icon"><Setting /></el-icon>
          初始化数据库
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Lock, Setting } from '@element-plus/icons-vue'
import { login, checkDbStatus } from '@/api/auth'  // 需要创建这个API
import { useUserStore } from '@/stores/user'  // 需要创建这个store

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login({
          username: loginForm.value.username,
          password: loginForm.value.password
        })
        
        if (res.success) {
          console.log('登录响应数据:', res.data)
          
          // 处理记住密码
          if (loginForm.value.remember) {
            localStorage.setItem('savedUser', JSON.stringify({
              username: loginForm.value.username,
              password: loginForm.value.password
            }))
          } else {
            localStorage.removeItem('savedUser')
          }
          
          userStore.setUserInfo(res.data)
          console.log('保存后的用户信息:', userStore.userInfo)
          
          ElMessage.success('登录成功')
          await router.push('/dashboard')
        }
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 检查是否有记住的登录信息
onMounted(() => {
  const savedUser = localStorage.getItem('savedUser')
  if (savedUser) {
    const { username, password } = JSON.parse(savedUser)
    loginForm.value.username = username
    loginForm.value.password = password
    loginForm.value.remember = true
  }
})

// 修改初始化方法
const goToInit = () => {
  console.log('点击初始化按钮')
  router.push('/init/db')
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
}

.login-card {
  width: 380px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-top: 20px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #409EFF 0%, #79bbff 100%);
  border: none;
  margin-top: 10px;
}

.login-button:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #8cc5ff 100%);
  transform: translateY(-1px);
}

.link-container {
  margin-top: 20px;
  text-align: center;
}

.link-container .el-link {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.link-icon {
  font-size: 16px;
}

/* 添加响应式设计 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 20px;
  }
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.login-form :deep(.el-checkbox__label) {
  color: #606266;
}
</style> 