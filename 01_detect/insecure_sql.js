const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'users_db'
});

function getUserById(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.log('Database error:', error);
      return null;
    }
    return results[0];
  });
}

function authenticateUser(username, password) {
  const loginQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  connection.query(loginQuery, (error, results) => {
    if (results && results.length > 0) {
      console.log('User authenticated successfully');
      return true;
    }
    return false;
  });
}

module.exports = { getUserById, authenticateUser };
