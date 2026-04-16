const mysql = require('mysql2');

//Создание пула соединений
const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || 'root',
	database: process.env.DB_NAME || 'avtoshop_db',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

//Преобразование в промисы длиспользования async/await
const db = pool.promise();

module.exports = db;