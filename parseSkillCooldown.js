const axios = require('axios');

const ddragonAPI = axios.create({
    baseURL: 'http://ddragon.leagueoflegends.com/'
});
const riotAPI = axios.create({
    baseURL: 'https://kr.api.riotgames.com/'
});

let api_key = process.env.API_KEY;

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