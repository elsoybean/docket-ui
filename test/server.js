const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

const API_PREFIX = '/api';

process.env.API_PREFIX = API_PREFIX;

app.use(express.static('./test/static'));
app.use('/js', express.static('./dist'));
app.use(
  API_PREFIX,
  proxy('http://localhost:3000', {
    proxyReqPathResolver: ({ url }) => `${API_PREFIX}${url}`,
  }),
);

app.listen(3001);
