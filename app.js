const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use('static', express.static(path.resolve(__dirname, "./static")));
//app.engine('html', require('ejs').renderFile);

const index = require('./routes/index');
const rank = require('./routes/rank');

app.use('/', index);
app.use('/', rank);

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})