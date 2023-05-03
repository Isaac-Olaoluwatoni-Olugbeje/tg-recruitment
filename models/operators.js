const mysql = require("mysql2/promise");
const idConverter = require("../middleware/id_converter");
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Salvation144k",
  database: "tg_recruitment",
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const Operator = {
  async operatorRegistration(
    full_name,
    phone_number,
    nationality,
    state,
    lga,
    sex,
    date_of_birth,
    nin
  ) {
    const [resultId] = await pool.execute(
      "SELECT COUNT(*) as count FROM operators"
    );
    const operatorCount = resultId[0].count;
    const id = idConverter(operatorCount);

    const [result] = await pool.execute(
      'INSERT INTO operators (id, full_name, phone_number, nationality, state, lga, sex, date_of_birth, nin, user_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "NaN")',
      [
        id,
        full_name,
        phone_number,
        nationality,
        state,
        lga,
        sex,
        date_of_birth,
        nin,
      ]
    );
    return { user_id: result.insertId };
  },

  async updateOperatorProfilePicture(profilePicture, operatorId) {
    const [result] = await pool.execute(
      "UPDATE operators SET user_picture = ? WHERE id = ?",
      [profilePicture, operatorId]
    );
    return result.affectedRows > 0;
  },  

  async getOperatorByEmail(email) {
    const [result] = await pool.execute(
      "SELECT * FROM users WHERE auth_level = 'operator' AND email = ?",
      [email]
    );
    return result[0];
  },

  async getOperatorById(id) {
    const [result] = await pool.execute(
      "SELECT * FROM operators WHERE id = ?",
      [id]
    );
    return result[0];
  },

  async updateOperatorVerification(verificationStatus, operatorId) {
    const [result] = await pool.execute(
      "UPDATE operator_verifications SET verification_status = ? WHERE operator_id = ?",
      [verificationStatus, operatorId]
    );
    return result[0];
  },

  async checkVerificationStatus(operatorId) {
    const [result] = await pool.execute(
      "SELECT verification_status FROM operator_verifications WHERE operator_id = ?",
      [operatorId]
    );
    return result[0];
  },
};

module.exports = Operator;
