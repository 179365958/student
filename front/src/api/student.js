import request from '@/utils/request'

// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/students',
    method: 'get',
    params
  })
}

// 添加学生
export function addStudent(data) {
  return request({
    url: '/students',
    method: 'post',
    data
  })
}

// 更新学生
export function updateStudent(id, data) {
  return request({
    url: `/students/${id}`,
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(id) {
  return request({
    url: `/students/${id}`,
    method: 'delete'
  })
} 