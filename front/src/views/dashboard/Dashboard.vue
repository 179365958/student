<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in statisticsCards" :key="card.title">
        <el-card class="statistics-card" :body-style="{ padding: '20px' }">
          <div class="card-content">
            <el-icon class="card-icon" :class="card.type">
              <component :is="card.icon"></component>
            </el-icon>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, School, Calendar, Document } from '@element-plus/icons-vue'
import { getDashboardStats } from '@/api/dashboard'
import { ElMessage } from 'element-plus'

const statisticsCards = ref([
  {
    title: '学生总数',
    value: '0',
    icon: 'User',
    type: 'primary'
  },
  {
    title: '班级总数',
    value: '0',
    icon: 'School',
    type: 'success'
  },
  {
    title: '今日考勤',
    value: '0%',
    icon: 'Calendar',
    type: 'warning'
  },
  {
    title: '待处理事项',
    value: '0',
    icon: 'Document',
    type: 'danger'
  }
])

// 获取统计数据
const fetchStats = async () => {
  try {
    const res = await getDashboardStats()
    if (res.success) {
      const { studentCount, classCount, attendanceRate, todoCount } = res.data
      statisticsCards.value[0].value = studentCount.toString()
      statisticsCards.value[1].value = classCount.toString()
      statisticsCards.value[2].value = `${attendanceRate}%`
      statisticsCards.value[3].value = todoCount.toString()
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.statistics-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  font-size: 48px;
  padding: 15px;
  border-radius: 8px;
}

.card-icon.primary {
  background-color: #ecf5ff;
  color: #409eff;
}

.card-icon.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.card-icon.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.card-icon.danger {
  background-color: #fef0f0;
  color: #f56c6c;
}

.card-info {
  flex-grow: 1;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style> 