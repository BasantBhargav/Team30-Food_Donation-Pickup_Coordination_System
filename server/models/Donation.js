const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType: {
        type: String,
        required: [true, 'Food type is required']
    },
    quantity: {
        type: String,
        required: [true, 'Quantity is required']
    },
    expiryTime: {
        type: Date,
        required: [true, 'Expiry time is required']
    },
    location: {
        address: {
            type: String,
            default: 'Not specified'
        },
        lat: Number,
        lng: Number
    },
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'picked_up', 'expired', 'cancelled'],
        default: 'available'
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    claimedAt: {
        type: Date
    },
    pickedUpAt: {
        type: Date
    },
    otp: {
        type: String
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
DonationSchema.index({ status: 1, createdAt: -1 });
DonationSchema.index({ donor: 1 });
DonationSchema.index({ claimedBy: 1 });

module.exports = mongoose.model('Donation', DonationSchema);
