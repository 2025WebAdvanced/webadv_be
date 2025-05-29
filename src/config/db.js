const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.ROOT_PASSWORD,
  port: process.env.PORT,
  database: 'test_db'
});

connection.connect(error => {
  if (error)
    throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;