const axios = require('axios');

const ddragonAPI = axios.create({
    baseURL: 'http://ddragon.leagueoflegends.com/'
});

class VersionService {
    async getCurrentVersion() {
        try {
            const res = await ddragonAPI.get('api/versions.json');
            let currentVersion = res.data[0];
            return currentVersion;
        } catch (err) {
            return err;
        }
    }
}

export default VersionService;