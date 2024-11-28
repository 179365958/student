const { connectDB } = require('../config/db');

exports.getStudents = async (req, res) => {
  let pool;
  try {
    // 1. 获取参数并转换类型
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || '';
    const startRow = (page - 1) * pageSize;
    
    pool = await connectDB();
    
    // 2. 构建查询条件
    const whereClause = query 
      ? `WHERE s.Name LIKE '%${query}%' OR s.StudentNo LIKE '%${query}%'` 
      : '';
    
    // 3. 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM Students s 
      ${whereClause}
    `;
    
    // 4. 分页查询
    const dataSql = `
      SELECT TOP ${pageSize}
        s.StudentID,
        s.StudentNo,
        s.Name,
        s.Gender,
        s.BirthYear,
        s.Phone,
        s.Address,
        s.Status,
        c.ClassName,
        c.Grade
      FROM Students s
      LEFT JOIN Classes c ON s.ClassID = c.ClassID
      WHERE s.StudentID NOT IN (
        SELECT TOP ${startRow} StudentID
        FROM Students
        ORDER BY StudentNo
      )
      ${whereClause ? 'AND ' + whereClause.substring(6) : ''}
      ORDER BY s.StudentNo
    `;
    
    // 5. 执行查询
    const countResult = await pool.request().query(countSql);
    const dataResult = await pool.request().query(dataSql);
    
    // 6. 返回结果
    res.json({
      success: true,
      data: {
        rows: dataResult.recordset,
        count: countResult.recordset[0].total
      }
    });

  } catch (error) {
    console.error('获取学生列表失败:', error);
    console.error('错误详情:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || '获取学生列表失败'
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (err) {
        console.error('关闭数据库连接失败:', err);
      }
    }
  }
};

exports.addStudent = async (req, res) => {
  let pool;
  try {
    pool = await connectDB();
    const { StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status } = req.body;
    
    const result = await pool.request()
      .input('StudentNo', StudentNo)
      .input('Name', Name)
      .input('Gender', Gender)
      .input('BirthYear', BirthYear)
      .input('ClassID', ClassID)
      .input('Phone', Phone)
      .input('Address', Address)
      .input('Status', Status)
      .query(`
        INSERT INTO Students (StudentNo, Name, Gender, BirthYear, ClassID, Phone, Address, Status)
        VALUES (@StudentNo, @Name, @Gender, @BirthYear, @ClassID, @Phone, @Address, @Status);
        SELECT SCOPE_IDENTITY() as StudentID;
      `);
    
    res.json({
      success: true,
      data: { ...req.body, StudentID: result.recordset[0].StudentID }
    });
  } catch (error) {
    console.error('添加学生失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '添加学生失败'
    });
  }
};

exports.updateStudent = async (req, res) => {
  let pool;
  try {
    pool = await connectDB();
    const { id } = req.params;
    const { Name, Gender, BirthYear, ClassID, Phone, Address, Status } = req.body;
    
    await pool.request()
      .input('StudentID', id)
      .input('Name', Name)
      .input('Gender', Gender)
      .input('BirthYear', BirthYear)
      .input('ClassID', ClassID)
      .input('Phone', Phone)
      .input('Address', Address)
      .input('Status', Status)
      .query(`
        UPDATE Students
        SET Name = @Name,
            Gender = @Gender,
            BirthYear = @BirthYear,
            ClassID = @ClassID,
            Phone = @Phone,
            Address = @Address,
            Status = @Status
        WHERE StudentID = @StudentID
      `);
    
    res.json({
      success: true,
      data: req.body
    });
  } catch (error) {
    console.error('更新学生失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '更新学生失败'
    });
  }
};

exports.deleteStudent = async (req, res) => {
  let pool;
  try {
    pool = await connectDB();
    const { id } = req.params;
    
    await pool.request()
      .input('StudentID', id)
      .query('DELETE FROM Students WHERE StudentID = @StudentID');
    
    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除学生失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '删除学生失败'
    });
  }
}; 