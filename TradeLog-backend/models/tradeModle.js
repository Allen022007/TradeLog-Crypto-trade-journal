const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This links the trade to the specific user who created it
        },
        symbol: {
            type: String,
            required: [true, 'Please add a coin symbol (e.g., BTC)'],
        },
        type: {
            type: String,
            enum: ['Long', 'Short'], // Restricts value to only these two
            required: true,
        },
        entryPrice: {
            type: Number,
            required: true,
        },
        exitPrice: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Trade', tradeSchema);