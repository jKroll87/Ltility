const axios = require('axios');

const riotAPI = axios.create({
    baseURL: 'https://kr.api.riotgames.com/'
});

class RankService {
    // parameter: challenger/grandmaster/master
    async getLeagueEntries(tier) {
        let entries;
        const baseRank = {
            'challenger': parseInt(1),
            'grandmaster': parseInt(301),
            'master': parseInt(1001),
        }
        // Exception handling at the beginning of the season

        const res = await riotAPI.get(`/lol/league/v4/${tier}leagues/by-queue/RANKED_SOLO_5x5?api_key=${api_key}`)
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
}

export default RankService;