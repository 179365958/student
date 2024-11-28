const { sql } = require('../config/db');

class Class {
  // 获取班级列表
  static async findAndCountAll({ offset = 0, limit = 10, where = {} }) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      
      // 构建查询条件
      let whereClause = 'WHERE IsDelete = 0';
      if (where.query) {
        whereClause += ` AND (ClassName LIKE @query OR Grade LIKE @query)`;
      }

      // 获取总数
      const countResult = await pool.request()
        .input('query', sql.NVarChar, `%${where.query}%`)
        .query(`
          SELECT COUNT(*) as total 
          FROM Classes ${whereClause}
        `);
      const total = countResult.recordset[0].total;

      // 获取分页数据
      const result = await pool.request()
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .input('query', sql.NVarChar, `%${where.query}%`)
        .query(`
          SELECT * FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY CreateTime DESC) AS RowNum,
              ClassID,
              ClassNo,
              ClassName,
              Grade,
              TeacherName,
              StudentCount,
              Description,
              CreateTime,
              UpdateTime
            FROM Classes
            ${whereClause}
          ) AS Paged
          WHERE RowNum > @offset AND RowNum <= (@offset + @limit)
        `);

      return {
        rows: result.recordset,
        count: total
      };
    } catch (error) {
      console.error('查询班级列表失败:', error);
      throw error;
    }
  }

  // 创建班级
  static async create(classData) {
    try {
      console.log('创建班级 - 开始执行');
      console.log('创建班级 - 输入数据:', classData);

      const pool = await sql.connect(require('../config/db').config);
      console.log('创建班级 - 数据库连接成功');

      // 准备 SQL 参数
      const params = {
        ClassNo: classData.ClassNo,
        ClassName: classData.ClassName,
        Grade: classData.Grade,
        TeacherName: classData.TeacherName || null,
        StudentCount: classData.StudentCount || 0,
        Description: classData.Description || null,
        CreateTime: Math.floor(Date.now() / 1000),
        UpdateTime: Math.floor(Date.now() / 1000)
      };

      console.log('创建班级 - SQL参数:', params);

      const result = await pool.request()
        .input('ClassNo', sql.VarChar(10), params.ClassNo)
        .input('ClassName', sql.NVarChar(50), params.ClassName)
        .input('Grade', sql.NVarChar(20), params.Grade)
        .input('TeacherName', sql.NVarChar(20), params.TeacherName)
        .input('StudentCount', sql.Int, params.StudentCount)
        .input('Description', sql.NVarChar(500), params.Description)
        .input('CreateTime', sql.BigInt, params.CreateTime)
        .input('UpdateTime', sql.BigInt, params.UpdateTime)
        .query(`
          BEGIN TRANSACTION;
          
          DECLARE @NewClassID INT;

          INSERT INTO Classes (
            ClassNo, ClassName, Grade, TeacherName, 
            StudentCount, Description, CreateTime, UpdateTime
          )
          VALUES (
            @ClassNo, @ClassName, @Grade, @TeacherName, 
            @StudentCount, @Description, @CreateTime, @UpdateTime
          );

          SET @NewClassID = SCOPE_IDENTITY();

          SELECT * FROM Classes WHERE ClassID = @NewClassID;

          COMMIT TRANSACTION;
        `);

      console.log('创建班级 - SQL执行结果:', result);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('创建班级失败，未能获取新创建的记录');
      }

      return result.recordset[0];
    } catch (error) {
      console.error('创建班级失败 - 错误详情:', error);
      throw error;
    }
  }

  // 更新班级
  static async update(ClassID, classData) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      const result = await pool.request()
        .input('ClassID', sql.Int, ClassID)
        .input('ClassName', sql.NVarChar(50), classData.ClassName)
        .input('Grade', sql.NVarChar(20), classData.Grade)
        .input('TeacherName', sql.NVarChar(20), classData.TeacherName)
        .input('StudentCount', sql.Int, classData.StudentCount)
        .input('Description', sql.NVarChar(500), classData.Description)
        .input('UpdateTime', sql.BigInt, Math.floor(Date.now() / 1000))
        .query(`
          UPDATE Classes
          SET ClassName = @ClassName,
              Grade = @Grade,
              TeacherName = @TeacherName,
              StudentCount = @StudentCount,
              Description = @Description,
              UpdateTime = @UpdateTime
          WHERE ClassID = @ClassID
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('更新班级失败:', error);
      throw error;
    }
  }

  // 删除班级（软删除）
  static async delete(ClassID) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      const result = await pool.request()
        .input('ClassID', sql.Int, ClassID)
        .input('UpdateTime', sql.BigInt, Math.floor(Date.now() / 1000))
        .query(`
          UPDATE Classes
          SET IsDelete = 1,
              UpdateTime = @UpdateTime
          WHERE ClassID = @ClassID
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('删除班级失败:', error);
      throw error;
    }
  }
}

module.exports = Class;
