const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Salvation144k',
    database: 'tg_recruitment',
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const Admin = {
    async adminRegistration(full_name, user_id) {
        const [result] = await pool.execute(
           "INSERT INTO admins (full_name, user_id) VALUES (?, ?)", 
           [full_name, user_id]
        );
        return result[0];
    },
    
    async getAdminByEmail(email) {
        const [result] = await pool.execute(
           "SELECT * FROM users WHERE auth_level = 'admin' AND email = ?", 
           [email]
        );
        return result[0];
    },
    
    async createOperatorVerification(operatorId, adminId, verificationStatus, reason, dateOfVerification) {
        const [result] = await pool.execute(
          'INSERT INTO operator_verifications (operator_id, admin_id, verification_status, reason, created_at) VALUES (?, ?, ?, ?, ?)',
          [operatorId, adminId, verificationStatus, reason, dateOfVerification]
        );
        return {verification_id: result.insertId};
      }
};

module.exports = Admin;