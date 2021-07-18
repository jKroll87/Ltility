const axios = require('axios');

const ddragonAPI = axios.create({
    baseURL: 'http://ddragon.leagueoflegends.com/'
});
const riotAPI = axios.create({
    baseURL: 'https://kr.api.riotgames.com/'
});

let api_key = process.env.API_KEY;

// Version
exports.getRecentVersion = async () => {
    let recentVersion = undefined;

    await ddragonAPI.get('api/versions.json')
        .then((res) => {
            recentVersion = res.data[0];
        })
        .catch((error) => {
            console.log(error);
        });

    return recentVersion;
}

// ChampionSkillCooldowns
let getChampionCooldownFromName = (recentVersion, name, championSkillCooldowns) => {
    return ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion/' + name + '.json')
        .then((res) => {
            championSkillCooldowns[name] = [];
            for (let i = 0; i < 4; i++) {
                championSkillCooldowns[name].push(res.data.data[name].spells[i].cooldown);
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.getChampionSkillCoolDowns = async (recentVersion) => {
    let championName = undefined;
    let championSkillCooldowns = new Object();

    await ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion.json')
        .then((res) => {
            championName = Object.keys(res.data.data);
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

// ChampionSkillNames
let getChampionSkillNameFromName = (recentVersion, name, championSkillNames) => {
    return ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion/' + name + '.json')
        .then((res) => {
            championSkillNames[name] = [];
            for (let i = 0; i < 4; i++) {
                championSkillNames[name].push(res.data.data[name].spells[i].id);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getChampionSkillNames = async (recentVersion) => {
    let championName = undefined;
    let championSkillNames = new Object();

    await ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion.json')
        .then((res) => {
            championName = Object.keys(res.data.data);
        })
        .then(async () => {
            let awaits = championName.map((name) => {
                return getChampionSkillNameFromName(recentVersion, name, championSkillNames);
            })
            await Promise.all(awaits);
        })
        .catch((err) => {
            console.log(err);
        })

    return championSkillNames;
}

// ChampionName
let getChampionKeyFromName = (recentVersion, name, key2ChampionNameList) => {
    return ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion/' + name + '.json')
        .then((res) => {
            key2ChampionNameList[res.data.data[name].key] = name;
        });
}

exports.getKey2ChampionNameList = async (recentVersion) => {
    let championName = undefined;
    let key2ChampionNameList = new Object();

    await ddragonAPI.get('cdn/' + recentVersion + '/data/ko_KR/champion.json')
        .then((res) => {
            championName = Object.keys(res.data.data);
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

    await riotAPI.get("lol/summoner/v4/summoners/by-name/" + encodeURI(summonerName) + '?api_key=' + api_key)
        .then((res) => {
            summonerId = res.data.id;
        })
        .catch((error) => {
            console.log(error);
        })

    return summonerId;
}

// SummonerAccountID
exports.getSummonerAccountId = async (summonerName) => {
    let summonerAccountId = undefined;

    await riotAPI.get("lol/summoner/v4/summoners/by-name/" + encodeURI(summonerName) + '?api_key=' + api_key)
        .then((res) => {
            summonerAccountId = res.data.accountId;
        })
        .catch((error) => {
            console.log(error);
        })

    return summonerAccountId;
}

// Match
exports.getRecentMatchId = async (summonerAccountId) => {
    let gameId = undefined;

    await riotAPI.get('lol/match/v4/matchlists/by-account/' + summonerAccountId + '?api_key=' + api_key)
        .then((res) => {
            gameId = res.data.matches[0].gameId;
        })
        .catch((error) => {
            console.log(error);
        })

    return gameId;
}

// incomplete
exports.getMatch = async (gameId) => {
    let match = undefined;

    await riotAPI.get('lol/match/v4/matches/' + gameId + '?api_key=' + api_key)
        .then((res) => {
            console.log(res.data);
            match = res;
        })
        .catch((error) => {
            console.log(error);
        });

    return match;
}

// CurrentMatch
exports.getCurrentMatch = async (summonerId, key2ChampionNameList, championSkillCooldowns, championSkillNames) => {
    let matchParticipants = undefined;
    let participantInfo = new Array();
    let ret = {};
    ret.status = "OK";

    await riotAPI.get('/lol/spectator/v4/active-games/by-summoner/' + summonerId + '?api_key=' + api_key)
        .then((res) => {
            matchParticipants = res.data.participants;
            for (let i = 0; i < matchParticipants.length; i++) {
                participantInfo[i] = {
                    'championName': key2ChampionNameList[matchParticipants[i].championId],
                    'summonerName': matchParticipants[i].summonerName,
                    'skillCoolDowns': championSkillCooldowns[key2ChampionNameList[matchParticipants[i].championId]],
                    'skillNames': championSkillNames[key2ChampionNameList[matchParticipants[i].championId]]
                };
            }
            ret.result = participantInfo;
        })
        .catch((error) => {
            if (error.res.status === 404) {
                ret.status = "FAILED";
            }
            console.log(error);
        });

    return ret;
}

// parameter: challenger/grandmaster/master
exports.getLeagueEntries = async (tier) => {
    let entries;
    const baseRank = {
        'challenger': parseInt(1),
        'grandmaster': parseInt(301),
        'master': parseInt(1001),
    }
    // Exception handling at the beginning of the season

    await riotAPI.get(`/lol/league/v4/${tier}leagues/by-queue/RANKED_SOLO_5x5?api_key=${api_key}`)
        .then((res) => {
            entries = res.data.entries;
            entries.sort((a, b) => {
                if (a.leaguePoints !== b.leaguePoints) return b.leaguePoints - a.leaguePoints;
                return a.summonerName > b.summonerName ? 1 : -1;
            })
            for (let i in entries) {
                entries[i].rank = parseInt(i) + baseRank[tier];
                entries[i].tier = tier;
            }
        })

    return entries;
}