const Class = require('../models/Class');

class ClassController {
  // 获取班级列表
  static async getClassList(req, res) {
    try {
      const { page = 1, pageSize = 10, query = '' } = req.query;
      const offset = (page - 1) * pageSize;
      
      const result = await Class.findAndCountAll({
        offset,
        limit: parseInt(pageSize),
        where: { query }
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('获取班级列表失败:', error);
      res.status(500).json({
        success: false,
        message: error.message || '获取班级列表失败'
      });
    }
  }
}

module.exports = ClassController;