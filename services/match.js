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