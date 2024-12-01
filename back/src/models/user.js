const { connectDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../config/auth');

class User {
  static async findByUsername(username) {
    const pool = await connectDB();
    const result = await pool.request()
      .input('username', username)
      .query('SELECT UserID, Username, Password, Role FROM Users WHERE Username = @username');
    return result.recordset[0];
  }

  static async createUser(userData) {
    const pool = await connectDB();
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    
    const result = await pool.request()
      .input('username', userData.username)
      .input('password', hashedPassword)
      .input('name', userData.name)
      .input('role', userData.role || 'user')
      .query(`
        INSERT INTO Users (Username, Password, Name, Role)
        VALUES (@username, @password, @name, @role);
        SELECT SCOPE_IDENTITY() as id;
      `);
    
    return result.recordset[0].id;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    console.log('Plain password:', plainPassword);
    console.log('Hashed password from DB:', hashedPassword);
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password comparison result:', result);
    return result;
  }

  static async changePassword(userId, newPassword) {
    const pool = await connectDB();
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    const result = await pool.request()
      .input('userId', userId)
      .input('password', hashedPassword)
      .query('UPDATE Users SET Password = @password WHERE UserID = @userId');
    
    return result.rowsAffected[0] > 0;
  }
}

module.exports = User;
