const axios = require('axios');
const config = require('config');
const { response } = require('express');

const ddragonServer = axios.create({
    baseURL: 'http://ddragon.leagueoflegends.com/',
});
const riotDataServer = axios.create({
    baseURL: 'https://kr.api.riotgames.com/',
});

const api_key = config.get('api_key');

// Version
exports.getRecentVersion = async () => {
    let recentVersion = undefined;

    await ddragonServer.get('api/versions.json')
    .then((response) => {
        recentVersion = response.data[0];
    })
    .catch((error) => {
        console.log(error);
    });

    return recentVersion;
}

// ChampionSkillCooldowns
let getChampionCooldownFromName = (recentVersion, name, championSkillCooldowns) => {
    return ddragonServer.get('cdn/' + recentVersion + '/data/ko_KR/champion/' + name + '.json')
    .then((response) => {
        championSkillCooldowns[name] = [];
        for (let i = 0; i < 4; i++) {
            championSkillCooldowns[name].push(response.data.data[name].spells[i].cooldown);
        }
    });
}

exports.getChampionSkillCoolDowns = async (recentVersion) => {
    let championName = undefined;
    let championSkillCooldowns = new Object();
    
    await ddragonServer.get('cdn/' + recentVersion + '/data/ko_KR/champion.json')
    .then((response) => {
        championName = Object.keys(response.data.data);
    })
    .then(async () => {
        let awaits = championName.map((name) => {
            return getChampionCooldownFromName(recentVersion, name, championSkillCooldowns);
        })
        await Promise.all(awaits);
    })
    .catch((error) => {
        console.log(error);
    })

    return championSkillCooldowns;
}

// ChampionName
let getChampionKeyFromName = (recentVersion, name, key2ChampionNameList) => {
    return ddragonServer.get('cdn/' + recentVersion + '/data/ko_KR/champion/' + name + '.json')
    .then((response) => {
        key2ChampionNameList[response.data.data[name].key] = name;
    });
}

exports.getKey2ChampionNameList = async (recentVersion) => {
    let championName = undefined;
    let key2ChampionNameList = new Object();
    
    await ddragonServer.get('cdn/' + recentVersion + '/data/ko_KR/champion.json')
    .then((response) => {
        championName = Object.keys(response.data.data);
    })
    .then(async () => {
        let awaits = championName.map((name) => {
            return getChampionKeyFromName(recentVersion, name, key2ChampionNameList);
        })
        await Promise.all(awaits);
    })
    .catch((error) => {
        console.log(error);
    })

    return key2ChampionNameList;
}

// SummonerID
exports.getSummonerId = async (summonerName) => {
    let summonerId = undefined;

    await riotDataServer.get("lol/summoner/v4/summoners/by-name/" + encodeURI(summonerName) + '?api_key=' + api_key)
    .then((response) => {
        summonerId = response.data.id;
    })
    .catch((error) => {
        console.log(error);
    })

    return summonerId;
}

// SummonerAccountID
exports.getSummonerAccountId = async (summonerName) => {
    let summonerAccountId = undefined;

    await riotDataServer.get("lol/summoner/v4/summoners/by-name/" + encodeURI(summonerName) + '?api_key=' + api_key)
    .then((response) => {
        summonerAccountId = response.data.accountId;
    })
    .catch((error) => {
        console.log(error);
    })

    return summonerAccountId;
}

// Match
exports.getRecentMatchId = async (summonerAccountId) => {
    let gameId = undefined;

    await riotDataServer.get('lol/match/v4/matchlists/by-account/' + summonerAccountId + '?api_key=' + api_key)
    .then((response) => {
        gameId = response.data.matches[0].gameId;
    })
    .catch((error) => {
        console.log(error);
    })
    
    return gameId;
}

// incomplete
exports.getMatch = async (gameId) => {
    let match = undefined;

    await riotDataServer.get('lol/match/v4/matches/' + gameId + '?api_key=' + api_key)
    .then((response) => {
        console.log(response.data);
        match = response;
    })
    .catch((error) => {
        console.log(error);
    });

    return match;
}

// CurrentMatch
exports.getCurrentMatch = async (summonerId, key2ChampionNameList, championSkillCooldowns) => {
    let matchParticipants = undefined;
    let participantInfo = new Array();
    let ret = {};
    ret.status = "OK";

    await riotDataServer.get('/lol/spectator/v4/active-games/by-summoner/' + summonerId + '?api_key=' + api_key)
    .then((response) => {
        matchParticipants = response.data.participants;
        for (let i = 0; i < matchParticipants.length; i++) {
            participantInfo[i] = {
                'championName': key2ChampionNameList[matchParticipants[i].championId],
                'summonerName': matchParticipants[i].summonerName,
                'skillCoolDowns': championSkillCooldowns[key2ChampionNameList[matchParticipants[i].championId]]
            };
        }
        ret.result = participantInfo;
    })
    .catch((error) => {
        if (error.response.status === 404) {
            ret.status = "FAILED";
        }
        console.log(error);
    });

    return ret;
}