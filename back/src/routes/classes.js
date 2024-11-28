const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// 获取班级列表
router.get('/', ClassController.getClassList);
// 创建班级
router.post('/', ClassController.createClass);
// 更新班级
router.put('/:id', ClassController.updateClass);
// 删除班级
router.delete('/:id', ClassController.deleteClass);

module.exports = router;
