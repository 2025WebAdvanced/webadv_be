require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const postRouter = require('./routes/postService')

app.set('port', 8080);

app.use(express.json());
app.use(cors({
	origin: 'http://localhost:3000'
}))

app.use('/post', postRouter);

app.listen(app.get('port'), () => {
    console.log('Server is running on port', app.get('port'))
})
