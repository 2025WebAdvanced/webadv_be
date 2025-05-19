require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.set('port', 8080);

app.use(cors({
	origin: 'http://localhost:3000'
}))

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER_NAME,
	password: process.env.ROOT_PASSWORD,
	port: process.env.PORT,
	database: 'test_db'
});

app.get('/', (req, res) => {
    res.send('Hello, Express')
		console.log('request appeared to root uri');
})

app.get('/test/json', (req, res) => {
    res.json({
			message: 'Hello, Express'
		});
})

app.listen(app.get('port'), () => {
    console.log('Server is running on port', app.get('port'))
})
