const express = require('express');
const router = express.Router();
const parseSkillCooldown = require("../parseSkillCooldown.js");

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', async (req, res) => {
    try {
        let recentVersion = await parseSkillCooldown.getRecentVersion();
        let championSkillCooldowns = await parseSkillCooldown.getChampionSkillCoolDowns(recentVersion);
        let championSkillNames = await parseSkillCooldown.getChampionSkillNames(recentVersion);
        let key2ChampionNameList = await parseSkillCooldown.getKey2ChampionNameList(recentVersion);
        let summonerId = await parseSkillCooldown.getSummonerId(req.body.summoner_name);
        let currentMatch = await parseSkillCooldown.getCurrentMatch(summonerId, key2ChampionNameList, championSkillCooldowns, championSkillNames);

        if (currentMatch.status === "OK") {
            res.render('result', {
                recentVersion: recentVersion,
                currentMatch: currentMatch.result
            });
        }
        else {
            res.send("이 소환사는 게임 중이 아닙니다.");
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;