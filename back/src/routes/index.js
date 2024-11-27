const express = require('express');
const router = express.Router();

// 导入路由
const studentsRouter = require('./students');  // 改为 students.js
const authRouter = require('./auth');
const dbRouter = require('./db');

// API路由
router.use('/api/students', studentsRouter);
router.use('/api/auth', authRouter);
router.use('/api/db', dbRouter);

module.exports = router; 