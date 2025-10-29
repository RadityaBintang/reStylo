const db = require('../config/database');

const getRecommendations = async (req, res) => {
  const { weight, height } = req.query;

  if (!weight || !height) {
    return res.status(400).json({ success: false, message: 'Weight and height are required' });
  }

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  if (isNaN(weightNum) || isNaN(heightNum)) {
    return res.status(400).json({ success: false, message: 'Invalid weight or height value' });
  }

  try {
    const [results] = await db.query(`
      SELECT o.*, 
        (SELECT AVG(rating) FROM outfit_ratings WHERE outfit_id = o.id) as avg_rating,
        (SELECT COUNT(*) FROM outfit_likes WHERE outfit_id = o.id) as likes_count,
        t.id as top_id, t.name as top_name, t.image_url as top_image,
        b.id as bottom_id, b.name as bottom_name, b.image_url as bottom_image
      FROM outfits o
      LEFT JOIN tops t ON o.top_id = t.id
      LEFT JOIN bottoms b ON o.bottom_id = b.id
      WHERE o.min_weight <= ? AND o.max_weight >= ?
        AND o.min_height <= ? AND o.max_height >= ?
      ORDER BY avg_rating DESC
      LIMIT 8
    `, [weightNum, weightNum, heightNum, heightNum]);

    console.log('DEBUG: Recommendation results =', results);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const index = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, 
             (SELECT AVG(rating) FROM outfit_ratings WHERE outfit_id = o.id) AS avg_rating,
             (SELECT COUNT(*) FROM outfit_likes WHERE outfit_id = o.id) AS likes_count,
             t.id as top_id, t.name as top_name, t.image_url as top_image,
             b.id as bottom_id, b.name as bottom_name, b.image_url as bottom_image
      FROM outfits o
      LEFT JOIN tops t ON o.top_id = t.id
      LEFT JOIN bottoms b ON o.bottom_id = b.id
    `);

    res.json({ success: true, recommendations: rows });
  } catch (err) {
    console.error('Error in index:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  try {
    const [results] = await db.query(`
      SELECT o.*, 
        (SELECT AVG(rating) FROM outfit_ratings WHERE outfit_id = o.id) as avg_rating,
        (SELECT COUNT(*) FROM outfit_likes WHERE outfit_id = o.id) as likes_count,
        t.id as top_id, t.name as top_name, t.image_url as top_image, t.category as top_category,
        b.id as bottom_id, b.name as bottom_name, b.image_url as bottom_image, b.category as bottom_category
      FROM outfits o
      LEFT JOIN tops t ON o.top_id = t.id
      LEFT JOIN bottoms b ON o.bottom_id = b.id
      WHERE o.id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Outfit not found' });
    }

    res.json({ success: true, data: results[0] });
  } catch (err) {
    console.error('Error fetching outfit detail:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getRecommendations,
  index,
  getDetail,
};