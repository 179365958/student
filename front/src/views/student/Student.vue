<template>
  <div class="student-management">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <div class="left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索学生姓名/学号"
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
          <el-icon><Plus /></el-icon>添加学生
        </el-button>
      </div>
    </div>

    <!-- 学生列表表格 -->
    <el-table
      :data="studentList"
      border
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="StudentNo" label="学号" width="120" />
      <el-table-column prop="Name" label="姓名" width="120" />
      <el-table-column prop="Gender" label="性别" width="80" />
      <el-table-column prop="BirthYear" label="出生年份" width="100" />
      <el-table-column prop="ClassName" label="班级" width="120" />
      <el-table-column prop="Grade" label="年级" width="120" />
      <el-table-column prop="Phone" label="联系电话" width="120" />
      <el-table-column prop="Address" label="住址" min-width="200" />
      <el-table-column prop="Status" label="状态" width="100" />
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

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加学生' : '编辑学生'"
      v-model="dialogVisible"
      width="600px"
      draggable
    >
      <el-form
        ref="formRef"
        :model="studentForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="学号" prop="StudentNo">
          <el-input v-model="studentForm.StudentNo" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="姓名" prop="Name">
          <el-input v-model="studentForm.Name" />
        </el-form-item>
        <el-form-item label="性别" prop="Gender">
          <el-radio-group v-model="studentForm.Gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生年份" prop="BirthYear">
          <el-input-number 
            v-model="studentForm.BirthYear" 
            :min="1990" 
            :max="new Date().getFullYear()"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="班级" prop="ClassID">
          <el-select 
            v-model="studentForm.ClassID" 
            placeholder="请选择班级"
            clearable
          >
            <el-option
              v-for="item in classList"
              :key="item.ClassID"
              :label="item.ClassName"
              :value="item.ClassID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="Phone">
          <el-input v-model="studentForm.Phone" />
        </el-form-item>
        <el-form-item label="住址" prop="Address">
          <el-input v-model="studentForm.Address" type="textarea" />
        </el-form-item>
        <el-form-item label="状态" prop="Status">
          <el-select v-model="studentForm.Status">
            <el-option label="在读" value="在读" />
            <el-option label="休学" value="休学" />
            <el-option label="退学" value="退学" />
          </el-select>
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
import { getStudentList, deleteStudent, createStudent, updateStudent } from '@/api/student'
import { getClassList } from '@/api/class'

// 表格数据
const loading = ref(false)
const studentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// 对话框数据
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const studentForm = ref({
  StudentID: '',
  StudentNo: '',
  Name: '',
  Gender: '男',
  BirthYear: new Date().getFullYear() - 18,
  ClassID: '',
  Phone: '',
  Address: '',
  Status: '在读'
})

// 班级列表
const classList = ref([])

// 表单验证规则
const rules = {
  StudentNo: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^S\d{3}$/, message: '学号格式如：S001', trigger: 'blur' }
  ],
  Name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  Gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  BirthYear: [{ required: true, message: '请输入出生年份', trigger: 'blur' }],
  ClassID: [{ required: true, message: '请选择班级', trigger: 'change' }],
  Phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  Status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取学生列表
const getStudents = async () => {
  loading.value = true
  try {
    console.log('请求参数:', {
      page: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    })
    
    const res = await getStudentList({
      page: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    })
    
    console.log('学生列表响应:', res)  // 添加这行日志
    
    if (res.success) {
      studentList.value = res.data.rows
      total.value = res.data.count
      console.log('处理后的数据:', {
        list: studentList.value,
        total: total.value
      })
    } else {
      ElMessage.error(res.message || '获取学生列表失败')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

// 获取班级列表
const fetchClassList = async () => {
  try {
    const res = await getClassList()
    console.log('班级列表原始响应:', res)
    
    if (res.success) {  // 使用 success 判断
      classList.value = res.data.rows  // 取 data.rows 作为班级列表
      console.log('处理后的班级列表:', classList.value)
    } else {
      ElMessage.error(res.message || '获取班级列表失败')
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    ElMessage.error('获取班级列表失败')
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getStudents()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getStudents()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getStudents()
}

// 添加学生
const handleAdd = () => {
  dialogType.value = 'add'
  studentForm.value = {
    StudentID: '',
    StudentNo: '',
    Name: '',
    Gender: '男',
    BirthYear: new Date().getFullYear() - 18,
    ClassID: '',
    Phone: '',
    Address: '',
    Status: '在读'
  }
  dialogVisible.value = true
}

// 编辑学生
const handleEdit = (row) => {
  dialogType.value = 'edit'
  studentForm.value = { ...row }
  dialogVisible.value = true
}

// 删除学生
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除学生 ${row.Name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteStudent(row.StudentID)
      ElMessage.success('删除成功')
      getStudents()
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
          await createStudent(studentForm.value)
          ElMessage.success('添加成功')
        } else {
          await updateStudent(studentForm.value.StudentID, studentForm.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        getStudents()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    }
  })
}

// 页面加载时获取数据
onMounted(() => {
  fetchClassList()
  getStudents()
})
</script>

<style scoped>
.student-management {
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
