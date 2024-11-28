<template>
  <div class="class-management">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索班级名称"
          class="search-input"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>添加班级
        </el-button>
      </div>
    </div>

    <!-- 班级列表表格 -->
    <el-table
      :data="classList"
      border
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="ClassNo" label="班级编号" width="120" />
      <el-table-column prop="ClassName" label="班级名称" width="150" />
      <el-table-column prop="Grade" label="年级" width="100" />
      <el-table-column prop="TeacherName" label="班主任" width="120" />
      <el-table-column prop="StudentCount" label="学生人数" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.StudentCount || 0 }}人</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="CreateTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatTimestamp(row.CreateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑班级对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加班级' : '编辑班级'"
      v-model="dialogVisible"
      width="500px"
      draggable
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="formRef"
        :model="classForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="班级编号" prop="ClassNo">
          <el-input v-model="classForm.ClassNo" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="班级名称" prop="ClassName">
          <el-input v-model="classForm.ClassName" />
        </el-form-item>
        <el-form-item label="年级" prop="Grade">
          <el-select
            v-model="classForm.Grade"
            placeholder="请选择年级"
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
          >
            <el-option
              v-for="grade in gradeOptions"
              :key="grade"
              :label="grade"
              :value="grade"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任" prop="TeacherName">
          <el-input v-model="classForm.TeacherName" />
        </el-form-item>
        <el-form-item label="学生人数" prop="StudentCount">
          <el-input-number v-model="classForm.StudentCount" :min="0" />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input v-model="classForm.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getClassList, deleteClass, createClass, updateClass } from '@/api/class'

// 表格数据
const loading = ref(false)
const classList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// 对话框数据
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const classForm = ref({
  ClassID: '',
  ClassNo: '',
  ClassName: '',
  Grade: '',
  TeacherName: '',
  StudentCount: 0,
  Description: ''
})

// 年级选项
const gradeOptions = ref([
  '一年级',
  '二年级',
  '三年级',
  '四年级',
  '五年级',
  '六年级',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三'
])

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '--'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

// 表单验证规则
const rules = {
  ClassNo: [
    { required: true, message: '请输入班级编号', trigger: 'blur' },
    { pattern: /^C\d{3}$/, message: '班级编号格式如：C001', trigger: 'blur' }
  ],
  ClassName: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  Grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  TeacherName: [{ required: true, message: '请输入班主任姓名', trigger: 'blur' }],
  StudentCount: [{ required: true, message: '请输入学生人数', trigger: 'blur' }]
}

// 获取班级列表
const getClasses = async () => {
  loading.value = true
  try {
    console.log('请求参数:', {
      page: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    })
    
    const res = await getClassList({
      page: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    })
    
    console.log('班级列表响应:', res)
    
    if (res.success) {
      classList.value = res.data.rows
      total.value = res.data.count
      console.log('处理后的数据:', {
        list: classList.value,
        total: total.value
      })
    } else {
      ElMessage.error(res.message || '获取班级列表失败')
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    ElMessage.error('获取班级列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getClasses()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getClasses()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getClasses()
}

// 添加班级
const handleAdd = () => {
  dialogType.value = 'add'
  classForm.value = {
    ClassID: '',
    ClassNo: '',
    ClassName: '',
    Grade: '',
    TeacherName: '',
    StudentCount: 0,
    Description: ''
  }
  dialogVisible.value = true
}

// 编辑班级
const handleEdit = (row) => {
  dialogType.value = 'edit'
  classForm.value = { ...row }
  dialogVisible.value = true
}

// 删除班级
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除班级 ${row.ClassName} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteClass(row.ClassID)
      ElMessage.success('删除成功')
      getClasses()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createClass(classForm.value)
          ElMessage.success('添加成功')
        } else {
          await updateClass(classForm.value.ClassID, classForm.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        getClasses()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  getClasses()
})
</script>

<style scoped>
.class-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style> 