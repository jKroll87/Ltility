const express = require('express');
const RankService = require('../../services/rank');

const rankService = new RankService();

const router = express.Router();

router.get('/', async (req, res) => {
    const summoner = await rankService.getAllLeagueEntries();
    res.json(summoner);
})

module.exports = router;