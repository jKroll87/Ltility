const express = require('express');
const VersionService = require('../../services/version');
// 너무 깊어지면 node 절대경로 사용 가능 확인해보자
// require path?

const versionService = new VersionService();

const router = express.Router();

router.get('/', async (req, res) => {
    const version = await versionService.getCurrentVersion();
    res.json({'current': version});
})

module.exports = router;