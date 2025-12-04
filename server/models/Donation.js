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
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        }
    },
    imageUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['available', 'claimed', 'picked_up', 'expired', 'cancelled'],
        default: 'available'
    },
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    claimedAt: {
        type: Date,
        default: null
    },
    pickedUpAt: {
        type: Date,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for better performance
DonationSchema.index({ status: 1, createdAt: -1 });
DonationSchema.index({ donor: 1 });
DonationSchema.index({ claimedBy: 1 });

module.exports = mongoose.model('Donation', DonationSchema);
