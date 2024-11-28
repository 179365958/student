const { sql } = require('../config/db');

class Class {
  // 获取班级列表
  static async findAndCountAll({ offset = 0, limit = 10, where = {} }) {
    try {
      const pool = await sql.connect(require('../config/db').config);
      
      // 构建查询条件
      let whereClause = '';
      const params = [];
      if (where.query) {
        whereClause = `WHERE ClassName LIKE @query OR Grade LIKE @query`;
        params.push({
          name: 'query',
          value: `%${where.query}%`
        });
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
              ClassName,
              Grade,
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
}

module.exports = Class;
