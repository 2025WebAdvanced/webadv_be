require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: process.env.USER_NAME,
	password: process.env.ROOT_PASSWORD,
	port: process.env.PORT,
	database: 'test_db'
});

const app = express();
app.set('port', 8080);

const getAllUsers = () => {
	connection.query('select * from users order by id desc', (err, rows, fields) => {
		if(err) throw err;
		console.log(rows);
		return rows;
	});
}

app.get('/', (req, res) => {
    res.send('Hello, Express')
})

app.get('/getUsers', (req, res) => {
    res.json(getAllUsers());
})

app.listen(app.get('port'), () => {
    console.log('Server is running on port', app.get('port'))
})
