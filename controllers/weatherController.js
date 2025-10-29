const db = require('../config/database');

const getWeatherRecommendations = async (req, res) => {
  const { weather, temperature } = req.query;

  if (!weather || !temperature) {
    return res.status(400).json({ 
      success: false, 
      message: 'Weather and temperature are required' 
    });
  }

  const tempNum = parseFloat(temperature);

  if (isNaN(tempNum)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid temperature value' 
    });
  }

  try {
    // Query berdasarkan cuaca dan range temperatur
    const [results] = await db.query(`
      SELECT o.*, 
        (SELECT AVG(rating) FROM outfit_ratings WHERE outfit_id = o.id) as avg_rating,
        (SELECT COUNT(*) FROM outfit_likes WHERE outfit_id = o.id) as likes_count
      FROM outfits o
      WHERE o.weather_type = ? 
        AND o.min_temperature <= ? 
        AND o.max_temperature >= ?
      ORDER BY avg_rating DESC
      LIMIT 8
    `, [weather, tempNum, tempNum]);

    console.log('DEBUG: Weather recommendation results =', results);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching weather recommendations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  getWeatherRecommendations
};