const express = require('express');
const router = express.Router();
const { connectDB } = require('../config/db');

// 获取仪表盘统计数据
router.get('/stats', async (req, res) => {
  try {
    const pool = await connectDB();
    
    // 使用一个查询获取所有统计数据
    const result = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM Students) as studentCount,
        (SELECT COUNT(*) FROM Classes) as classCount
    `);

    // 返回数据
    res.json({
      success: true,
      data: {
        studentCount: result.recordset[0].studentCount,
        classCount: result.recordset[0].classCount,
        attendanceRate: 98,  // 模拟数据
        todoCount: 5         // 模拟数据
      }
    });

  } catch (error) {
    console.error('获取仪表盘统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
});

module.exports = router;
