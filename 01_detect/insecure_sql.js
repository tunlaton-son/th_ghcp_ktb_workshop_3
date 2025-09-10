const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "users_db",
});

function getUserById(userId) {
  // ใช้ prepared statement เพื่อป้องกัน SQL injection
  const query = "SELECT * FROM users WHERE id = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.log("Database error:", error);
        reject(error);
        return;
      }
      resolve(results[0] || null);
    });
  });
}

function authenticateUser(username, password) {
  // ใช้ prepared statement และ hash password
  const loginQuery = "SELECT * FROM users WHERE username = ?";

  return new Promise((resolve, reject) => {
    connection.query(loginQuery, [username], async (error, results) => {
      if (error) {
        console.log("Database error:", error);
        reject(error);
        return;
      }

      if (results && results.length > 0) {
        const user = results[0];
        // เปรียบเทียบ password ที่ hash แล้ว
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
          console.log("User authenticated successfully");
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}

// ฟังก์ชันสำหรับสร้าง user ใหม่ (bonus)
async function createUser(username, password, email) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const insertQuery =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    connection.query(
      insertQuery,
      [username, hashedPassword, email],
      (error, results) => {
        if (error) {
          console.log("Database error:", error);
          reject(error);
          return;
        }
        resolve(results.insertId);
      }
    );
  });
}

module.exports = { getUserById, authenticateUser, createUser };
