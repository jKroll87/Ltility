const express = require('express');
const router = express.Router()

const champion = require('./routes/champion');
const match = require('./routes/match');
const rank = require('./routes/rank');
const summoner = require('./routes/summoner');
const version = require('./routes/version');

// 복수형으로 수정?
router.use('/champion', champion);
// router.use('/match', match);
router.use('/rank', rank);
router.use('/summoner', summoner);
router.use('/version', version);

// export default router;
module.exports = router;