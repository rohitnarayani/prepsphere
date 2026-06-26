import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const PostExperience = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [branch, setBranch] = useState(user?.branch || '');
  const [ctc, setCtc] = useState('');
  const [rounds, setRounds] = useState([
    { roundType: 'Coding', questions: '', notes: '' },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddRound = () => {
    setRounds((prev) => [
      ...prev,
      { roundType: 'Technical', questions: '', notes: '' },
    ]);
  };

  const handleRemoveRound = (index) => {
    if (rounds.length === 1) {
      alert('You must describe at least one interview round.');
      return;
    }
    setRounds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoundChange = (index, field, value) => {
    setRounds((prev) =>
      prev.map((round, i) => (i === index ? { ...round, [field]: value } : round))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyName || !year || !branch || !ctc) {
      setError('Please fill in all general details.');
      return;
    }

    if (parseFloat(ctc) <= 0) {
      setError('CTC must be a positive value.');
      return;
    }

    const invalidRound = rounds.some((r) => !r.questions.trim());
    if (invalidRound) {
      setError('Please write down the questions asked in all added rounds.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        companyName: companyName.trim(),
        year: parseInt(year, 10),
        branch: branch.trim(),
        ctc: parseFloat(ctc),
        rounds,
      };

      await axiosInstance.post('/experiences', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit experience. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roundTypes = ['Coding', 'Technical', 'HR', 'Group Discussion', 'System Design', 'Aptitude', 'Managerial'];
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-bg-base min-h-screen text-text-primary">
      <div className="bg-surface-card border border-border-divider p-8 sm:p-10 rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Share Your Placement Experience
          </h1>
          <p className="mt-2.5 text-sm text-text-muted">
            Document your interview rounds, questions, and insights to assist junior students in their preparation.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Details */}
          <div className="bg-bg-base/30 p-6 sm:p-8 rounded-xl border border-border-divider space-y-6">
            <h2 className="text-lg font-heading font-bold text-gray-205 border-b border-border-divider pb-3">
              Placement Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Wipro"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  CTC Offered (LPA) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 15.0"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  Year of Interview *
                </label>
                <input
                  type="number"
                  required
                  min="2015"
                  max="2035"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  Branch *
                </label>
                <select
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-base border border-border-divider rounded-xl text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border-divider pb-3">
              <h2 className="text-xl font-heading font-bold text-gray-205">
                Rounds Logged
              </h2>
              <button
                type="button"
                onClick={handleAddRound}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-[#8576E9] px-3.5 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-xl transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Round
              </button>
            </div>

            <div className="space-y-6">
              {rounds.map((round, index) => (
                <div
                  key={index}
                  className="bg-bg-base/20 border border-border-divider rounded-2xl p-6 sm:p-8 relative group shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4 mb-5">
                    <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
                      Round {index + 1}
                    </span>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRound(index)}
                        className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-text-muted mb-2">
                        Round Type *
                      </label>
                      <select
                        value={round.roundType}
                        onChange={(e) => handleRoundChange(index, 'roundType', e.target.value)}
                        className="w-full md:w-64 px-4 py-2 bg-bg-base border border-border-divider rounded-xl text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
                      >
                        {roundTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-muted mb-2">
                        Questions Asked *
                      </label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Detail the programming assignments, puzzles, or system architecture questions asked..."
                        value={round.questions}
                        onChange={(e) => handleRoundChange(index, 'questions', e.target.value)}
                        className="w-full px-4 py-3 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-muted mb-2">
                        Preparation Notes / Observations
                      </label>
                      <textarea
                        rows="3"
                        placeholder="e.g. Focus on time complexity, practice recursion, read up on system caching..."
                        value={round.notes}
                        onChange={(e) => handleRoundChange(index, 'notes', e.target.value)}
                        className="w-full px-4 py-3 bg-bg-base border border-border-divider rounded-xl text-text-primary placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 justify-end pt-5 border-t border-border-divider">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 text-sm font-bold text-text-muted hover:text-text-primary border border-border-divider rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-primary hover:bg-[#5b4cc4] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-brand-primary/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Experience</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostExperience;
