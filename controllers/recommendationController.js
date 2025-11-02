const OutfitModel = require('../models/OutfitModel');

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
    // Panggil fungsi dari model
    const results = await OutfitModel.getRecommendations(weightNum, heightNum);

    console.log('DEBUG: Recommendation results =', results);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const index = async (req, res) => {
  // Fungsi index ini tampaknya tidak terpakai di rute,
  // tetapi jika dipakai, ini juga harus memanggil model.
  try {
    // const [rows] = await db.query(`...`);
    // Sebaiknya buat fungsi baru di OutfitModel jika ini diperlukan
    res.json({ success: true, message: "Fungsi 'index' perlu diimplementasikan via Model" });
  } catch (err) {
    // ...
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }

  try {
    // Panggil fungsi dari model
    const outfit = await OutfitModel.getById(id);

    if (!outfit) {
      return res.status(404).json({ success: false, message: 'Outfit not found' });
    }

    res.json({ success: true, data: outfit });
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