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

      // 格式化返回数据
      const rows = result.rows.map((item, index) => ({
        RowNum: (page - 1) * pageSize + index + 1,
        ClassID: item.ClassID,
        ClassNo: item.ClassNo,
        ClassName: item.ClassName,
        Grade: item.Grade,
        TeacherName: item.TeacherName,
        StudentCount: item.StudentCount,
        Description: item.Description,
        CreateTime: item.CreateTime,
        UpdateTime: item.UpdateTime
      }));

      res.json({
        success: true,
        data: {
          rows,
          count: result.count
        }
      });
    } catch (error) {
      console.error('获取班级列表失败:', error);
      res.status(500).json({
        success: false,
        message: error.message || '获取班级列表失败'
      });
    }
  }

  // 创建班级
  static async createClass(req, res) {
    try {
      console.log('创建班级 - 接收到的数据:', req.body);
      
      // 验证必填字段
      if (!req.body.ClassNo || !req.body.ClassName || !req.body.Grade) {
        throw new Error('班级编号、班级名称和年级为必填项');
      }

      const result = await Class.create(req.body);
      console.log('创建班级 - 数据库返回结果:', result);

      if (!result) {
        throw new Error('创建班级失败，未返回数据');
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('创建班级失败:', error);
      res.status(500).json({
        success: false,
        message: error.message || '创建班级失败'
      });
    }
  }

  // 更新班级
  static async updateClass(req, res) {
    try {
      const { id } = req.params;
      const success = await Class.update(id, req.body);
      res.json({
        success: true,
        data: success
      });
    } catch (error) {
      console.error('更新班级失败:', error);
      res.status(500).json({
        success: false,
        message: error.message || '更新班级失败'
      });
    }
  }

  // 删除班级
  static async deleteClass(req, res) {
    try {
      const { id } = req.params;
      const success = await Class.delete(id);
      res.json({
        success: true,
        data: success
      });
    } catch (error) {
      console.error('删除班级失败:', error);
      res.status(500).json({
        success: false,
        message: error.message || '删除班级失败'
      });
    }
  }
}

module.exports = ClassController;