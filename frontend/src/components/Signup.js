import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Pill } from 'lucide-react';
import { register } from '../api/authApi';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
];

const Signup = ({ onLogin, onGoLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'pharmacist',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      localStorage.setItem('dh_token', data.token);
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      onLogin(data.user);
      toast.success(`Account created! Welcome, ${data.user.fullName.split(' ')[0]}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between relative overflow-hidden"
        style={{ backgroundColor: '#121358' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 p-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#121358' }}>
              <Pill size={18} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: '#121358' }}>
              DRUG HUB
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 text-center">
          <div className="inline-flex items-center gap-2 border border-white border-opacity-30 text-white text-xs px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            JOIN THE PLATFORM
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Get Started<br />Today
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Create your account to manage your drug store inventory, track expiry dates, and more.
          </p>
        </div>

        <div className="relative z-10 border-t border-white border-opacity-20 px-10 py-5 flex items-center justify-between">
          <div className="text-center">
            <p className="text-white font-bold text-xl">Free</p>
            <p className="text-blue-300 text-xs uppercase tracking-wider">To Use</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">Real-time</p>
            <p className="text-blue-300 text-xs uppercase tracking-wider">Alerts</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">100%</p>
            <p className="text-blue-300 text-xs uppercase tracking-wider">Secure</p>
          </div>
          <p className="text-blue-300 text-xs">© 2026 Drug Hub</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-1 mb-6">
            <span className="w-6 h-0.5" style={{ backgroundColor: '#121358' }} />
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#121358' }}>
              Create Account
            </p>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Get started</h1>
          <p className="text-gray-400 text-sm mb-8">Create your Drug Hub account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Mensah"
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-200'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@drughub.com"
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`w-full border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-200'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95 mt-2"
              style={{ backgroundColor: '#121358' }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={onGoLogin}
              className="font-bold hover:underline"
              style={{ color: '#121358' }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
