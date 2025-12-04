const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');

// @route   GET api/stats
// @desc    Get platform statistics
// @access  Public
router.get('/', async (req, res) => {
    try {
        const totalDonations = await Donation.countDocuments();
        const activeDonations = await Donation.countDocuments({ status: 'available' });
        const completedDonations = await Donation.countDocuments({ status: 'picked_up' });
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalVolunteers = await User.countDocuments({ role: 'volunteer' });

        // Calculate estimated meals (1kg = 4 meals assumption)
        const donations = await Donation.find({ status: 'picked_up' });
        let estimatedMeals = 0;
        donations.forEach(d => {
            const qty = parseFloat(d.quantity) || 0;
            if (d.quantity.toLowerCase().includes('kg')) {
                estimatedMeals += qty * 4;
            } else if (d.quantity.toLowerCase().includes('meal')) {
                estimatedMeals += qty;
            } else {
                estimatedMeals += qty * 2; // Default assumption
            }
        });

        res.json({
            totalDonations,
            activeDonations,
            completedDonations,
            totalDonors,
            totalVolunteers,
            estimatedMeals: Math.round(estimatedMeals),
            impactMessage: `${Math.round(estimatedMeals)} meals saved this month!`
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
