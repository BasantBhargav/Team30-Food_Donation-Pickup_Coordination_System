import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        expiryTime: '',
        address: '',
        imageUrl: ''
    });

    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    // Fetch donations
    const fetchDonations = async () => {
        try {
            const res = await axios.get(`${API_URL}/donations/my`, config);
            setDonations(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Compress and convert image to smaller base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create image element to compress
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
            img.src = event.target.result;
            img.onload = () => {
                // Create canvas to resize
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 300; // Max width/height
                let width = img.width;
                let height = img.height;

                // Scale down
                if (width > height && width > MAX_SIZE) {
                    height = (height * MAX_SIZE) / width;
                    width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                    width = (width * MAX_SIZE) / height;
                    height = MAX_SIZE;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Get compressed base64 (quality 0.6)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                setImagePreview(compressedBase64);
                setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
            };
        };
        reader.readAsDataURL(file);
    };

    // Remove image
    const removeImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const body = {
                foodType: formData.foodType,
                quantity: formData.quantity,
                expiryTime: formData.expiryTime,
                location: { address: formData.address },
                imageUrl: formData.imageUrl || ''
            };

            await axios.post(`${API_URL}/donations`, body, config);

            // Reset form
            setFormData({ foodType: '', quantity: '', expiryTime: '', address: '', imageUrl: '' });
            setImagePreview('');

            // Refresh list
            await fetchDonations();

            alert('✅ Donation posted successfully!');
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.msg || 'Failed to post. Try without image.');
        } finally {
            setLoading(false);
        }
    };

    // Delete donation
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this donation?')) return;

        try {
            await axios.delete(`${API_URL}/donations/${id}`, config);
            fetchDonations();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    // Calculate stats
    const stats = {
        total: donations.length,
        available: donations.filter(d => d.status === 'available').length,
        claimed: donations.filter(d => d.status === 'claimed').length,
        completed: donations.filter(d => d.status === 'picked_up').length
    };

    return (
        <div className="min-h-screen py-6 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🍲 Donor Dashboard</h1>
                    <p className="text-gray-500">Share surplus food with those in need</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-gray-500 text-xs">Total</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                        <p className="text-gray-500 text-xs">Available</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-yellow-600">{stats.claimed}</p>
                        <p className="text-gray-500 text-xs">Claimed</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl text-center shadow">
                        <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                        <p className="text-gray-500 text-xs">Completed</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Post Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow sticky top-4">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="bg-green-100 p-2 rounded-lg">📦</span>
                                Post Donation
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload - Optional */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Photo (optional)</label>
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Food" className="w-full h-28 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-green-400">
                                            <span className="text-xl">📷</span>
                                            <span className="text-xs text-gray-400">Click to add photo</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>

                                {/* Food Type */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Food Type *</label>
                                    <input
                                        type="text"
                                        name="foodType"
                                        value={formData.foodType}
                                        onChange={handleChange}
                                        placeholder="e.g., Biryani, Rice"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Quantity *</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="e.g., 5kg, 10 meals"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                {/* Best Before */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Best Before *</label>
                                    <input
                                        type="datetime-local"
                                        name="expiryTime"
                                        value={formData.expiryTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter full address"
                                        required
                                        rows={2}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    {loading ? '⏳ Posting...' : '🚀 Request Pickup'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Donations List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-bold mb-4">My Donations ({donations.length})</h2>

                        {donations.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center shadow">
                                <div className="text-5xl mb-3">🍽️</div>
                                <p className="text-gray-600 font-medium">No donations yet</p>
                                <p className="text-gray-400 text-sm">Post your first donation!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {donations.map(donation => (
                                    <div key={donation._id} className="bg-white rounded-xl shadow overflow-hidden">
                                        <div className="flex">
                                            {/* Image */}
                                            <div className="w-28 h-28 bg-green-50 flex-shrink-0 flex items-center justify-center">
                                                {donation.imageUrl ? (
                                                    <img src={donation.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-3xl">🍲</span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{donation.foodType}</h3>
                                                        <p className="text-gray-500 text-xs">
                                                            📦 {donation.quantity} • ⏰ {new Date(donation.expiryTime).toLocaleString()}
                                                        </p>
                                                        <p className="text-gray-400 text-xs truncate max-w-[200px]">
                                                            📍 {donation.location?.address}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${donation.status === 'available' ? 'bg-green-100 text-green-700' :
                                                                donation.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {donation.status.toUpperCase()}
                                                        </span>

                                                        {donation.status === 'available' && (
                                                            <button
                                                                onClick={() => handleDelete(donation._id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* OTP for claimed */}
                                                {donation.status === 'claimed' && (
                                                    <div className="mt-2 bg-blue-600 text-white p-2 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-[10px] opacity-70">🔐 OTP</p>
                                                                <p className="text-xl font-mono font-bold">{donation.otp}</p>
                                                            </div>
                                                            {donation.claimedBy && (
                                                                <div className="text-right text-xs">
                                                                    <p className="opacity-70">Volunteer</p>
                                                                    <p className="font-semibold">{donation.claimedBy.name}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Completed */}
                                                {donation.status === 'picked_up' && (
                                                    <div className="mt-2 bg-green-50 text-green-700 p-2 rounded-lg text-center text-sm">
                                                        ✅ Delivered Successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
