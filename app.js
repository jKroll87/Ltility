const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const parseSkillCooldown = require("./routes/parseSkillCooldown.js");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    fs.readFile('public/test.html', (err, data) => {
        if (err) console.log(err);
        else {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
});

app.post('/', async (req, res) => {
    try {
        let recentVersion = await parseSkillCooldown.getRecentVersion();
        let championSkillCooldowns = await parseSkillCooldown.getChampionSkillCoolDowns(recentVersion);
        let key2ChampionNameList = await parseSkillCooldown.getKey2ChampionNameList(recentVersion);
        let summonerId = await parseSkillCooldown.getSummonerId(req.body.summoner_name);
        let currentMatch = await parseSkillCooldown.getCurrentMatch(summonerId, key2ChampionNameList, championSkillCooldowns);
        res.send(currentMatch);
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})