const axios = require('axios');

module.exports = {
    ddragonAPI: axios.create({
        baseURL: 'http://ddragon.leagueoflegends.com/',
    }),
    riotAPI: axios.create({
        baseURL: 'https://kr.api.riotgames.com/'
    })
}