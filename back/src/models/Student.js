const { sql } = require('../config/db');

class Student {
  // 获取学生列表
  static async findAndCountAll({ offset = 0, limit = 10, where = {} }) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      
      // 构建查询条件
      let whereClause = '';
      if (where.query) {
        whereClause = `WHERE s.StudentNo LIKE @query OR s.Name LIKE @query`;
      }

      // 获取总数
      const countResult = await pool.request()
        .input('query', sql.NVarChar, where.query ? `%${where.query}%` : '')
        .query(`
          SELECT COUNT(*) as total 
          FROM Students s ${whereClause}
        `);
      const total = countResult.recordset[0].total;

      // 获取分页数据
      const result = await pool.request()
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .input('query', sql.NVarChar, where.query ? `%${where.query}%` : '')
        .query(`
          SELECT s.*, c.ClassName, c.Grade
          FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY CreateTime DESC) AS RowNum, *
            FROM Students s
            ${whereClause}
          ) AS s
          LEFT JOIN Classes c ON s.ClassID = c.ClassID
          WHERE RowNum > @offset AND RowNum <= (@offset + @limit)
        `);

      console.log('查询结果:', { total, rows: result.recordset }); // 添加日志

      return {
        rows: result.recordset,
        count: total
      };
    } catch (error) {
      console.error('查询学生列表失败:', error);
      throw error;
    }
  }
}

module.exports = Student;
