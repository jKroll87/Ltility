const express = require('express');
const router = express.Router();
const parseSkillCooldown = require("../parseSkillCooldown.js");

router.get('/rank', async (req, res) => {
    let challengerEntries = await parseSkillCooldown.getLeagueEntries('challenger');
    let grandmasterEntries = await parseSkillCooldown.getLeagueEntries('grandmaster');
    let masterEntries = await parseSkillCooldown.getLeagueEntries('master');
    let entries = [...challengerEntries, ...grandmasterEntries, ...masterEntries];
    res.header("Access-Control-Allow-Origin", "*");
    res.json(entries);
});

module.exports = router;