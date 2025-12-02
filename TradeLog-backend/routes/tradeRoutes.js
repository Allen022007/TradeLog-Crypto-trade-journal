const express = require('express');
const router = express.Router();
const {
    getTrades,
    createTrade,
    updateTrade,
    deleteTrade,
} = require('../controllers/tradeControl');

// Import the security middleware
const { protect } = require('../middleware/authMiddleware');

// Chain the routes for cleaner code
router.route('/').get(protect, getTrades).post(protect, createTrade);
router.route('/:id').put(protect, updateTrade).delete(protect, deleteTrade);

module.exports = router;