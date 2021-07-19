// db 정보

const express = require('express');
const SummonerService = require('../../services/summoner');

const summonerService = new SummonerService();

const router = express.Router();

router.get('/:name', async (req, res) => {
    const summonerName = req.params.name;
    const summoner = await summonerService.getSummoner(summonerName);
    res.json(summoner);
})

module.exports = router;