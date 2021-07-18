const express = require('express');
const router = express.Router()

const version = require('./routes/version');
const a;

router.get('', (req, res) => {
    res.send('This is Home!')
})

router.use('/users', version);


export default router;