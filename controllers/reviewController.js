const ReviewModel = require('../models/ReviewModel.js');


exports.getReviewsByOutfitId = async (req, res) => {
    const outfitId = req.params.outfitId;

    try {
        // Panggil fungsi dari model
        const reviews = await ReviewModel.getReviewsByOutfitsId(outfitId);
        res.json({ success: true, reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};


exports.addReview = async (req, res) => {
    const { username, rating, comment, outfits_id } = req.body;

    if (!username || !rating || !comment || !outfits_id) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Panggil fungsi dari model
        await ReviewModel.addReview(username, rating, comment, outfits_id);
        res.json({ success: true, message: 'Review added successfully' });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ success: false, message: 'Failed to add review' });
    }
};