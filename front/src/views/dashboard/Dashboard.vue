<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
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

    <!-- 其他仪表盘内容 -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, School, Calendar, Document } from '@element-plus/icons-vue'

const statisticsCards = ref([
  {
    title: '学生总数',
    value: '1,234',
    icon: 'User',
    type: 'primary'
  },
  {
    title: '班级总数',
    value: '32',
    icon: 'School',
    type: 'success'
  },
  {
    title: '今日考勤',
    value: '98%',
    icon: 'Calendar',
    type: 'warning'
  },
  {
    title: '待处理事项',
    value: '12',
    icon: 'Document',
    type: 'danger'
  }
])
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