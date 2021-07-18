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