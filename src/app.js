require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const postRouter = require('./routes/postService');
const authRouter = require('./routes/authService');
const commentRouter = require('./routes/commentService');
const userRouter = require('./routes/userService');

app.set('port', 8080);

app.use(express.json());
app.use(cors({
	origin: ['http://localhost:3000', 'http://localhost:80']
}))

app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/comment', commentRouter);
app.use('/user', userRouter);

app.listen(app.get('port'), () => {
    console.log('Server is running on port', app.get('port'))
})
