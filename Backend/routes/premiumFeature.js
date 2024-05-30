const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature');

const authenticatmiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticatmiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;