const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');
const { authenticateToken } = require('../middlewares/auth');

// Routes tanpa auth untuk public access
router.get('/tops/public', async (req, res) => {
  try {
    const category = req.query.category || 'Casual';
    const tops = await require('../models/SaveModel').getTops(category);
    res.json(tops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load tops' });
  }
});

router.get('/bottoms/public', async (req, res) => {
  try {
    const category = req.query.category || 'Casual';
    const bottoms = await require('../models/SaveModel').getBottoms(category);
    res.json(bottoms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load bottoms' });
  }
});

// Routes dengan auth
router.get('/tops', authenticateToken, async (req, res) => {
  try {
    const category = req.query.category || 'Casual';
    const tops = await require('../models/SaveModel').getTops(category);
    res.json(tops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load tops' });
  }
});

router.get('/bottoms', authenticateToken, async (req, res) => {
  try {
    const category = req.query.category || 'Casual';
    const bottoms = await require('../models/SaveModel').getBottoms(category);
    res.json(bottoms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load bottoms' });
  }
});

router.get('/select', authenticateToken, outfitController.select);
router.post('/select-item', authenticateToken, outfitController.selectItem);
router.post('/save-form', authenticateToken, outfitController.saveForm);
router.post('/save', authenticateToken, outfitController.save);
router.get('/saved', authenticateToken, outfitController.savedOutfits);
router.delete('/saved/:id', authenticateToken, outfitController.deleteOutfit);
router.delete('/:id', authenticateToken, outfitController.deleteOutfit);

module.exports = router;