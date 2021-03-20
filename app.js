const express = require('express');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
//app.engine('html', require('ejs').renderFile);

const index = require('./routes/index.js');

app.use('/', index);

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})