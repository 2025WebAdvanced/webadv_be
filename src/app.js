const express = require('express');
const app = express();

app.set('port', 8080);

app.get('/', (req, res) => {
    res.send('Hello, Express')
})

app.listen(app.get('port'), () => {
    console.log('Server is running on port', app.get('port'))
})