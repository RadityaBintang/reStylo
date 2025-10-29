const express = require('express');
const router = express.Router();
const { getWeatherRecommendations } = require('../controllers/weatherController');

router.get('/', getWeatherRecommendations);

module.exports = router;