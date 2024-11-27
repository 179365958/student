const Student = require('../models/student');

// 获取学生列表
exports.getStudents = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;
    
    // 直接在控制器中查询数据库
    const list = await Student.find()
      .skip(skip)
      .limit(Number(pageSize));
    const total = await Student.countDocuments();
    
    res.json({
      success: true,
      data: {
        list,
        total
      }
    });
  } catch (error) {
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