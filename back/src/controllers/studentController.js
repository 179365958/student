const Student = require('../models/Student');
const Class = require('../models/Class');

// 获取学生列表
exports.getStudents = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, query = '' } = req.query;
    const offset = (page - 1) * pageSize;
    
    console.log('查询参数:', { page, pageSize, query, offset });

    const result = await Student.findAndCountAll({
      offset,
      limit: parseInt(pageSize),
      where: { query }
    });

    console.log('查询结果:', result);

    // 获取班级列表（用于下拉选择）
    const classResult = await Class.findAndCountAll({
      offset: 0,
      limit: 1000  // 获取所有班级
    });

    res.json({
      success: true,
      data: {
        ...result,
        classes: classResult.rows
      }
    });
  } catch (error) {
    console.error('获取学生列表失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取学生列表失败'
    });
  }
};

// 添加学生
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '添加学生失败'
    });
  }
};

// 更新学生
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '更新学生失败'
    });
  }
};

// 删除学生
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || '删除学生失败'
    });
  }
}; 