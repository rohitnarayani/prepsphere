import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '1',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, branch, year } = formData;
    if (!name || !email || !password || !branch || !year) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/signup', {
        name,
        email,
        password,
        branch,
        year: parseInt(year, 10),
      });
      login(response.data);
      navigate('/');
    } catch (err) {
      let errorMsg = 'Failed to create account.';
      if (err.response?.data) {
        if (typeof err.response.data === 'object' && !err.response.data.error) {
          // Field validation errors
          errorMsg = Object.values(err.response.data).join(', ');
        } else {
          errorMsg = err.response.data.error || errorMsg;
        }
      }
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const branches = [
    'Computer Science & Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics & Communication Engineering (ECE)',
    'Electrical & Electronics Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Chemical Engineering (CHE)',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg-base px-4 py-12 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-lg bg-surface-card border border-border-divider p-8 sm:p-10 rounded-2xl shadow-xl shadow-black/40">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-text-primary tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="mt-2.5 text-sm text-text-muted">
            Join PrepSphere and start sharing placement experiences
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-405 flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-text-muted mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-650 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text-muted mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-650 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
              placeholder="johndoe@domain.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text-muted mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-655 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="branch" className="block text-sm font-semibold text-text-muted mb-2">
                Branch / Discipline
              </label>
              <select
                id="branch"
                name="branch"
                required
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
              >
                <option value="" disabled>Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b.split(' (')[1].replace(')', '')}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-text-muted mb-2">
                Current Year of Study
              </label>
              <select
                id="year"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brand-primary hover:bg-[#5b4cc4] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-brand-primary/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary hover:text-[#5b4cc4] font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
