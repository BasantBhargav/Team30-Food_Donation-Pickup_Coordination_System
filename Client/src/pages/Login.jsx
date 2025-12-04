import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    contact: ''
  });
  const navigate = useNavigate();

  const { name, email, password, role, contact } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isLogin
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';
      const body = isLogin ? { email, password } : formData;

      const res = await axios.post(url, body);

      // Clear any existing data first
      localStorage.clear();

      // Set new token and user
      localStorage.setItem('token', res.data.token);

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Navigate based on role
        if (res.data.user.role === 'donor') {
          navigate('/donor');
        } else {
          navigate('/volunteer');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 hero-pattern">
      <div className="max-w-5xl w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex w-1/2 gradient-animated p-12 text-white flex-col justify-between relative">
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10">
            <div className="text-6xl mb-6 animate-float">🍲</div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Share Food,<br />
              <span className="text-green-200">Save Lives.</span>
            </h1>
            <p className="text-green-100 text-lg opacity-90 leading-relaxed">
              Every meal shared is a step towards a hunger-free world. Join thousands making a difference.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl">🌍</div>
              <div>
                <p className="font-bold text-lg">10,000+ Meals</p>
                <p className="text-green-100 text-sm">Saved this month</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">🌱 Eco-Friendly</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">💚 Community</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {isLogin ? 'Welcome Back!' : 'Join the Movement'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-gray-500">
              {isLogin ? 'Access your dashboard' : 'Start your journey today'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                    <input type="text" placeholder="Full Name" name="name" value={name} onChange={onChange} required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all bg-gray-50 hover:bg-white" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                    <input type="text" placeholder="Contact No." name="contact" value={contact} onChange={onChange} required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all bg-gray-50 hover:bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, role: 'donor' })} className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${role === 'donor' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <span className="text-2xl">🍲</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Donor</p>
                      <p className="text-xs text-gray-500">Share food</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, role: 'volunteer' })} className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${role === 'volunteer' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <span className="text-2xl">🤝</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Volunteer</p>
                      <p className="text-xs text-gray-500">Deliver food</p>
                    </div>
                  </button>
                </div>
              </>
            )}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
              <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all bg-gray-50 hover:bg-white" />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required minLength={6} className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all bg-gray-50 hover:bg-white" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              {isLogin ? "New here? " : "Already a member? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 font-bold hover:text-green-700 transition-colors">
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
