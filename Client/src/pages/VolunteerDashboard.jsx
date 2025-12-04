import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const VolunteerDashboard = () => {
    const [availableDonations, setAvailableDonations] = useState([]);
    const [myClaimedDonations, setMyClaimedDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('available');
    const [otpInputs, setOtpInputs] = useState({});

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    const fetchAvailableDonations = async () => {
        try {
            const res = await axios.get(`${API_URL}/donations`, config);
            setAvailableDonations(res.data);
        } catch (err) {
            console.error('Error fetching donations:', err);
        }
    };

    const fetchMyClaimedDonations = async () => {
        try {
            const res = await axios.get(`${API_URL}/donations/claimed`, config);
            setMyClaimedDonations(res.data);
        } catch (err) {
            console.error('Error fetching claimed:', err);
        }
    };

    useEffect(() => {
        fetchAvailableDonations();
        fetchMyClaimedDonations();
    }, []);

    const handleClaim = async (donationId) => {
        if (!window.confirm('Claim this donation?')) return;
        setLoading(true);
        try {
            await axios.put(`${API_URL}/donations/${donationId}/claim`, {}, config);
            alert('✅ Donation claimed!');
            fetchAvailableDonations();
            fetchMyClaimedDonations();
            setActiveTab('claimed');
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to claim');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (donationId, value) => {
        setOtpInputs({ ...otpInputs, [donationId]: value });
    };

    const handleVerifyOtp = async (donationId) => {
        const otp = otpInputs[donationId];
        if (!otp || otp.length !== 4) {
            alert('Please enter 4-digit OTP');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/donations/${donationId}/verify`, { otp }, config);
            alert('✅ ' + res.data.msg);
            fetchMyClaimedDonations();
            setOtpInputs({ ...otpInputs, [donationId]: '' });
        } catch (err) {
            alert('❌ ' + (err.response?.data?.msg || 'Invalid OTP'));
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        available: availableDonations.length,
        claimed: myClaimedDonations.filter(d => d.status === 'claimed').length,
        completed: myClaimedDonations.filter(d => d.status === 'picked_up').length
    };

    return (
        <div className="min-h-screen py-6 bg-gray-50">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🤝 Volunteer Dashboard</h1>
                    <p className="text-gray-500">Help deliver food to those in need</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                        <p className="text-gray-500 text-sm">Available</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-yellow-600">{stats.claimed}</p>
                        <p className="text-gray-500 text-sm">My Claimed</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                        <p className="text-gray-500 text-sm">Completed</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <button onClick={() => setActiveTab('available')} className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'available' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
                        🍲 Available ({stats.available})
                    </button>
                    <button onClick={() => setActiveTab('claimed')} className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'claimed' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600'}`}>
                        📦 My Claims ({stats.claimed + stats.completed})
                    </button>
                </div>

                {activeTab === 'available' && (
                    <div className="space-y-4">
                        {availableDonations.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center shadow">
                                <div className="text-5xl mb-3">🔍</div>
                                <p className="text-gray-600 font-medium">No donations available</p>
                            </div>
                        ) : (
                            availableDonations.map(donation => (
                                <div key={donation._id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{donation.foodType}</h3>
                                        <p className="text-gray-500 text-sm">📦 {donation.quantity} • ⏰ {new Date(donation.expiryTime).toLocaleString()}</p>
                                        <p className="text-gray-400 text-sm">📍 {donation.location?.address}</p>
                                        {donation.donor && <p className="text-gray-400 text-sm">👤 {donation.donor.name}</p>}
                                    </div>
                                    <button onClick={() => handleClaim(donation._id)} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
                                        🙋 Claim
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'claimed' && (
                    <div className="space-y-4">
                        {myClaimedDonations.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center shadow">
                                <div className="text-5xl mb-3">📦</div>
                                <p className="text-gray-600 font-medium">No claimed donations</p>
                            </div>
                        ) : (
                            myClaimedDonations.map(donation => (
                                <div key={donation._id} className="bg-white rounded-xl shadow p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{donation.foodType}</h3>
                                            <p className="text-gray-500 text-sm">📦 {donation.quantity}</p>
                                            <p className="text-gray-400 text-sm">📍 {donation.location?.address}</p>
                                            {donation.donor && <p className="text-green-600 text-sm">👤 {donation.donor.name} {donation.donor.contact && `• 📞 ${donation.donor.contact}`}</p>}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${donation.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                            {donation.status === 'claimed' ? 'PENDING' : 'COMPLETED'}
                                        </span>
                                    </div>

                                    {donation.status === 'claimed' && (
                                        <div className="mt-3 bg-blue-50 p-4 rounded-xl">
                                            <p className="text-blue-700 text-sm font-medium mb-2">🔐 Enter OTP from Donor:</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    maxLength={4}
                                                    placeholder="4-digit OTP"
                                                    value={otpInputs[donation._id] || ''}
                                                    onChange={(e) => handleOtpChange(donation._id, e.target.value.replace(/\D/g, ''))}
                                                    className="flex-1 px-4 py-3 text-center text-2xl font-mono font-bold border-2 rounded-lg"
                                                />
                                                <button onClick={() => handleVerifyOtp(donation._id)} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                                                    ✓ Verify
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {donation.status === 'picked_up' && (
                                        <div className="mt-3 bg-green-50 p-3 rounded-lg text-center">
                                            <p className="text-green-700 font-medium">✅ Pickup completed!</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
