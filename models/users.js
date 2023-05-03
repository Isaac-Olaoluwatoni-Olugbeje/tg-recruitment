const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Salvation144k',
    database: 'tg_recruitment',
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const User = {
    async createUser(email, password, authorization_level) {
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, auth_level) VALUES (?, ?, ?)',
        [email, password, authorization_level]
      );
      return {user_id: result.insertId, email};
    },

    async getUserByUsername(username) {
        const [result] = await pool.execute(
           'SELECT * FROM users WHERE username = ?', 
           [username]
        );
        return result[0];
    },

    async getUserByEmail(email) {
      const [result] = await pool.execute(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return result.length > 0 ? result[0] : null;
    }
    

};

module.exports = User;
