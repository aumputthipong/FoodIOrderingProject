const mysql = require('mysql2/promise');

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
  });

  // สร้าง database ถ้ายังไม่มี
  await connection.query(`CREATE DATABASE IF NOT EXISTS webproproject CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
  await connection.query(`USE webproproject`);

  // สร้าง table shops ถ้ายังไม่มี
  await connection.query(`
    CREATE TABLE IF NOT EXISTS shops (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.end();
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webproproject',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
module.exports.initDatabase = initDatabase;

