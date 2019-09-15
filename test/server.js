const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

process.env.API_PREFIX = '/api';

app.use(express.static('./test/static'));
app.use('/js', express.static('./dist'));
app.use('/api', proxy('http://localhost:3000/api'));

app.listen(3001);
