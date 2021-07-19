const express = require('express');
const VersionService = require('../../services/version');
const ChampionService = require('../../services/champion');

const versionService = new VersionService();
const championService = new ChampionService();

const router = express.Router();

router.get('/', async(req, res) => {
    const version = await versionService.getCurrentVersion();
    const ret = await championService.getAllChampions(version, 'ko_KR');
    res.json(ret);
});


// 챔피언 10개 받아올 때 version 각각 받아올 필요는 없음
router.get('/:name', async(req, res) => {
    const version = await versionService.getCurrentVersion();
    const name = req.params.name;
    const champion = await championService.getChampion(version, 'ko_KR', name);

    champion.status !== 'SUCCESS' && res.status(404);
    res.json(champion);
});

module.exports = router;