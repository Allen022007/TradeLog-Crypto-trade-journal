const Trade = require('../models/tradeModle');

// @desc    Get all trades
// @route   GET /api/trades
// @access  Private
const getTrades = async (req, res) => {
    // Find trades ONLY for the logged-in user
    const trades = await Trade.find({ user: req.user.id });
    res.status(200).json(trades);
};

// @desc    Create a new trade
// @route   POST /api/trades
// @access  Private
const createTrade = async (req, res) => {
    const { symbol, type, entryPrice, notes } = req.body;

    if (!symbol || !type || !entryPrice) {
        res.status(400).json({ message: 'Please add all required fields' });
        return;
    }

    const trade = await Trade.create({
        symbol,
        type,
        entryPrice,
        notes,
        user: req.user.id, // Attach the user ID to the trade
    });

    res.status(200).json(trade);
};

// @desc    Update a trade
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = async (req, res) => {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
        res.status(404).json({ message: 'Trade not found' });
        return;
    }

    // Check if the user owns this trade
    if (trade.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedTrade = await Trade.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated object
    );

    res.status(200).json(updatedTrade);
};

// @desc    Delete a trade
// @route   DELETE /api/trades/:id
// @access  Private
const deleteTrade = async (req, res) => {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
        res.status(404).json({ message: 'Trade not found' });
        return;
    }

    // Check ownership
    if (trade.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await trade.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getTrades,
    createTrade,
    updateTrade,
    deleteTrade,
};