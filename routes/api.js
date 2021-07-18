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

const version = require('../components/version/version');

router.get('/version', async (req, res) => {
    let ret = await version.getRecentVersion();
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ version: ret });
})

router.get('/champion', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
})

router.get('/champion/:id', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
})

router.get('/matches/:summonerid', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
});

module.exports = router;