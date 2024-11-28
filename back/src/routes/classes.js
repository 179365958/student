const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// 获取班级列表
router.get('/', ClassController.getClassList);

module.exports = router;
