const { ddragonAPI } = require('../utils/api');

class ChampionService {
    // getChampions?
    async getChampions(version, region) {
        try {
            const res = await ddragonAPI.get(`cdn/${version}/data/${region}/champion.json`);
            return res;
        } catch (err) {
            return err;
        }
    }
    async getChampion(version, region, championName) {
        try {
            const res = await ddragonAPI.get(`cdn/${version}/data/${region}/champion/${championName}.json`);
            res.data.status = "SUCCESS"
            return res.data;
        } catch (err) {
            console.log(err);
            return { status: "FAILED", message: "not available champion" };
        }
    }
}

module.exports = ChampionService;

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