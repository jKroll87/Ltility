require('dotenv').config();

const express = require('express');

const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use('static', express.static(path.resolve(__dirname, "./static")));
//app.engine('html', require('ejs').renderFile);

// 

const index = require('./routes/index');
const api = require('./routes/api');

app.use('/', index);
app.use('/api', api);

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})

// /* eslint-disable global-require */
// import express from 'express'
// import config from './config'

// function startServer() {
//     const app = express();

//     require('./loaders').default(app)

//     app.listen(config.PORT, () => console.log(`👌Express Server Running on PORT ${config.PORT}`))
// }

// startServer()