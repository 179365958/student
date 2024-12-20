import request from '@/utils/request'

// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/api/students',
    method: 'get',
    params
  })
}

// 创建学生
export function createStudent(data) {
  return request({
    url: '/api/students',
    method: 'post',
    data
  })
}

// 更新学生
export function updateStudent(id, data) {
  return request({
    url: `/api/students/${id}`,
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(id) {
  return request({
    url: `/api/students/${id}`,
    method: 'delete'
  })
} 