const { riotAPI } = require('../utils/api');

const api_key = process.env.API_KEY;

class MatchService {
    async getCurrentMatch(summonerId) {
        let matchParticipants = undefined;
        let participantInfo = new Array();
        let ret = {};
        ret.status = "OK";

        try {
            const res = await riotAPI.get(`/lol/spectator/v4/active-games/by-summoner/${summonerId}?api_key=${api_key}`);
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
            return res;
        } catch (err) {
            
        }

        

            .then((res) => {
                
            })
            .catch((error) => {
                if (error.res.status === 404) {
                    ret.status = "FAILED";
                }
                console.log(error);
            });

        return ret;
    }
}

module.exports = MatchService;

// for -> reduce

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