const { riotAPI } = require('../utils/api');

const api_key = process.env.API_KEY;

class RankService {
    // parameter: challenger/grandmaster/master
    async getLeagueEntries(tier) {
        const baseRank = {
            'challenger': parseInt(1),
            'grandmaster': parseInt(301),
            'master': parseInt(1001),
        }
        // Exception handling at the beginning of the season
        try {
            const res = await riotAPI.get(`/lol/league/v4/${tier}leagues/by-queue/RANKED_SOLO_5x5?api_key=${api_key}`);
            let entries = res.data.entries;
            entries.sort((a, b) => {
                if (a.leaguePoints !== b.leaguePoints) return b.leaguePoints - a.leaguePoints;
                return a.summonerName > b.summonerName ? 1 : -1;
            })
            for (let i in entries) {
                entries[i].rank = parseInt(i) + baseRank[tier];
                entries[i].tier = tier;
            }
            return entries;
        } catch (err) {
            return err;
        }
    }

    async getAllLeagueEntries() {
        let challengerEntries = await this.getLeagueEntries('challenger');
        let grandmasterEntries = await this.getLeagueEntries('grandmaster');
        let masterEntries = await this.getLeagueEntries('master');
        let entries = [...challengerEntries, ...grandmasterEntries, ...masterEntries];
        return entries;
    }
}

module.exports = RankService;