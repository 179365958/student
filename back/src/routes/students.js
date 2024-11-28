const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// 获取学生列表
router.get('/', studentController.getStudents);

// 添加学生
router.post('/', studentController.addStudent);

// 更新学生
router.put('/:id', studentController.updateStudent);

// 删除学生
router.delete('/:id', studentController.deleteStudent);

module.exports = router; 