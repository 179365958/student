<template>
  <div class="db-init">
    <el-card class="db-init-card">
      <template #header>
        <div class="card-header">
          <h2>数据库初始化</h2>
          <p>首次使用需要初始化数据库</p>
        </div>
      </template>

      <div class="init-content">
        <el-alert
          v-if="!isInitialized"
          title="数据库未初始化"
          type="warning"
          :closable="false"
          class="mb-20"
        />
        
        <el-form :model="dbConfig" label-width="100px">
          <el-form-item label="服务器">
            <el-input v-model="dbConfig.server" placeholder="localhost" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="dbConfig.user" placeholder="sa" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="dbConfig.password" type="password" show-password />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleInitialize" 
              :loading="initializing"
            >
              {{ initializing ? '初始化中...' : '开始初始化' }}
            </el-button>
            <el-button @click="goToLogin">返回登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { initializeDb } from '@/api/db'

const router = useRouter()
const initializing = ref(false)
const dbConfig = ref({
  server: 'localhost',
  user: 'sa',
  password: ''
})

const handleInitialize = async () => {
  if (!dbConfig.value.password) {
    ElMessage.warning('请输入数据库密码')
    return
  }

  initializing.value = true
  try {
    const res = await initializeDb(dbConfig.value)
    if (res.success) {
      ElMessage.success('数据库初始化成功')
      setTimeout(() => router.push('/login'), 1500)
    }
  } catch (error) {
    ElMessage.error(error.message || '初始化失败')
  } finally {
    initializing.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script> 