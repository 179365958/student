const { sql } = require('../config/db');

class Student {
  // 获取学生列表（带分页和搜索）
  static async findAndCountAll({ offset = 0, limit = 10, where = {} }) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      
      // 构建查询条件
      let whereClause = '';
      if (where.query) {
        whereClause = `WHERE s.StudentNo LIKE '%${where.query}%' OR s.Name LIKE '%${where.query}%'`;
      }

      // 获取总数
      const countResult = await pool.request()
        .query(`
          USE StudentDB;
          SELECT COUNT(*) as total 
          FROM Students s ${whereClause}
        `);
      const total = countResult.recordset[0].total;

      // 获取分页数据（使用 ROW_NUMBER 代替 OFFSET FETCH）
      const result = await pool.request()
        .query(`
          USE StudentDB;
          WITH PagedStudents AS (
            SELECT 
              s.StudentID,
              s.StudentNo,
              s.Name,
              s.Gender,
              s.BirthYear,
              s.ClassID,
              s.Phone,
              s.Address,
              s.Status,
              s.CreateTime,
              s.UpdateTime,
              c.ClassName,
              c.Grade,
              ROW_NUMBER() OVER (ORDER BY s.CreateTime DESC) AS RowNum
            FROM Students s
            LEFT JOIN Classes c ON s.ClassID = c.ClassID
            ${whereClause}
          )
          SELECT 
            StudentID,
            StudentNo,
            Name,
            Gender,
            BirthYear,
            ClassID,
            Phone,
            Address,
            Status,
            CreateTime,
            UpdateTime,
            ClassName,
            Grade
          FROM PagedStudents 
          WHERE RowNum BETWEEN ${offset + 1} AND ${offset + limit}
        `);

      return {
        rows: result.recordset,
        count: total
      };
    } catch (error) {
      console.error('查询学生列表失败:', error);
      throw error;
    }
  }

  // 创建学生
  static async create(data) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      const result = await pool.request()
        .input('StudentNo', sql.NVarChar(20), data.StudentNo)
        .input('Name', sql.NVarChar(50), data.Name)
        .input('Gender', sql.NVarChar(10), data.Gender)
        .input('BirthYear', sql.Int, data.BirthYear)
        .input('ClassID', sql.Int, data.ClassID)
        .input('Phone', sql.NVarChar(20), data.Phone)
        .input('Address', sql.NVarChar(200), data.Address)
        .input('Status', sql.NVarChar(20), data.Status || '在读')
        .query(`
          USE StudentDB;
          INSERT INTO Students (
            StudentNo, Name, Gender, BirthYear, ClassID, 
            Phone, Address, Status, 
            CreateTime, UpdateTime
          )
          VALUES (
            @StudentNo, @Name, @Gender, @BirthYear, @ClassID,
            @Phone, @Address, @Status,
            DATEDIFF(second,'1970-01-01',GETDATE()),
            DATEDIFF(second,'1970-01-01',GETDATE())
          );
          
          SELECT SCOPE_IDENTITY() as StudentID;
        `);

      const studentId = result.recordset[0].StudentID;
      
      // 获取新创建的学生完整信息
      const newStudent = await pool.request()
        .input('StudentID', sql.Int, studentId)
        .query(`
          USE StudentDB;
          SELECT 
            s.*,
            c.ClassName,
            c.Grade
          FROM Students s
          LEFT JOIN Classes c ON s.ClassID = c.ClassID
          WHERE s.StudentID = @StudentID
        `);

      return newStudent.recordset[0];
    } catch (error) {
      console.error('创建学生失败:', error);
      throw error;
    }
  }

  // 更新学生
  static async update(id, data) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      await pool.request()
        .input('StudentID', sql.Int, id)
        .input('StudentNo', sql.NVarChar(20), data.StudentNo)
        .input('Name', sql.NVarChar(50), data.Name)
        .input('Gender', sql.NVarChar(10), data.Gender)
        .input('BirthYear', sql.Int, data.BirthYear)
        .input('ClassID', sql.Int, data.ClassID)
        .input('Phone', sql.NVarChar(20), data.Phone)
        .input('Address', sql.NVarChar(200), data.Address)
        .input('Status', sql.NVarChar(20), data.Status)
        .query(`
          USE StudentDB;
          UPDATE Students
          SET StudentNo = @StudentNo,
              Name = @Name,
              Gender = @Gender,
              BirthYear = @BirthYear,
              ClassID = @ClassID,
              Phone = @Phone,
              Address = @Address,
              Status = @Status,
              UpdateTime = DATEDIFF(second,'1970-01-01',GETDATE())
          WHERE StudentID = @StudentID
        `);

      // 获取更新后的学生完整信息
      const result = await pool.request()
        .input('StudentID', sql.Int, id)
        .query(`
          USE StudentDB;
          SELECT 
            s.*,
            c.ClassName,
            c.Grade
          FROM Students s
          LEFT JOIN Classes c ON s.ClassID = c.ClassID
          WHERE s.StudentID = @StudentID
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('更新学生失败:', error);
      throw error;
    }
  }

  // 删除学生
  static async destroy(id) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      const result = await pool.request()
        .input('StudentID', sql.Int, id)
        .query(`
          USE StudentDB;
          DELETE FROM Students 
          WHERE StudentID = @StudentID
        `);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('删除学生失败:', error);
      throw error;
    }
  }

  // 获取单个学生信息
  static async findById(id) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      const result = await pool.request()
        .input('StudentID', sql.Int, id)
        .query(`
          USE StudentDB;
          SELECT 
            s.*,
            c.ClassName,
            c.Grade
          FROM Students s
          LEFT JOIN Classes c ON s.ClassID = c.ClassID
          WHERE s.StudentID = @StudentID
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('获取学生信息失败:', error);
      throw error;
    }
  }
}

module.exports = Student;
