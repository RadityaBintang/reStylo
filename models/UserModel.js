const db = require('../config/database');
const bcrypt = require('bcrypt');

const UserModel = {
  
  async authenticate(username, password) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, password FROM users WHERE username = ?',
        [username]
      );

      const user = rows[0];
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }

      return null;
    } catch (err) {
      console.error('Error during authentication:', err);
      throw err;
    }
  },

  
  async usernameExists(username) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) AS count FROM users WHERE username = ?',
        [username]
      );

      return rows[0].count > 0;
    } catch (err) {
      console.error('Error checking username existence:', err);
      throw err;
    }
  },

  
  async createUser(username, hashedPassword) {
    try {
      const [result] = await db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );

      return {
        id: result.insertId,
        username: username
      };
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  
  async getUserById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, created_at FROM users WHERE id = ?',
        [id]
      );

      return rows[0] || null;
    } catch (err) {
      console.error('Error getting user by ID:', err);
      throw err;
    }
  }
  
};

module.exports = UserModel;