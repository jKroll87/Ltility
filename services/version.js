const {ddragonAPI} = require('../utils/api');

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

module.exports = VersionService;