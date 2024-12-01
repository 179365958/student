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
            <el-checkbox v-model="loginForm.remember">记住账号</el-checkbox>
            <el-link type="primary" @click="showChangePassword">忘记密码？</el-link>
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
    </el-card>
  </div>

  <!-- 修改密码对话框 -->
  <ChangePassword ref="changePasswordRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import ChangePassword from '@/components/ChangePassword.vue'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)
const changePasswordRef = ref(null)

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 显示修改密码对话框
const showChangePassword = () => {
  changePasswordRef.value?.show()
}

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
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    console.log('Attempting login with:', { username: loginForm.value.username })
    
    await userStore.login(loginForm.value.username, loginForm.value.password)
    
    // 如果选择记住账号，保存用户名
    if (loginForm.value.remember) {
      localStorage.setItem('rememberedUsername', loginForm.value.username)
    } else {
      localStorage.removeItem('rememberedUsername')
    }
    
    ElMessage.success('登录成功')
    await router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    ElMessage.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 检查是否有记住的用户名
onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.value.username = rememberedUsername
    loginForm.value.remember = true
  }
})
</script>

<style scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-top: 20px;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  width: 100%;
}
</style>