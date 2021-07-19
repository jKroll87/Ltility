const axios = require('axios');

const riotAPI = axios.create({
    baseURL: 'https://kr.api.riotgames.com/'
});

// require('dotenv').config()
const api_key = process.env.API_KEY;

class SummonerService {
    async getSummoner (summonerName) {
        try {
            const res = await riotAPI.get(`lol/summoner/v4/summoners/by-name/${encodeURI(summonerName)}?api_key=${api_key}`);
            return res;
        } catch (err) {
            return err;
        }
    }
}

module.exports = SummonerService;