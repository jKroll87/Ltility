const axios = require('axios');

const ddragonAPI = axios.create({
    baseURL: 'http://ddragon.leagueoflegends.com/'
});

module.exports = {
    async getRecentVersion() {
        try {
            const res = await ddragonAPI.get('api/versions.json');
            let recentVersion = res.data[0];
            return recentVersion;
        } catch (err) {
            return err;
        }
    }
}