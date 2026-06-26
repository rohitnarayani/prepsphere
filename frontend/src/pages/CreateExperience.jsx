import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experienceAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CreateExperience = () => {
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

    // Verify all rounds have content
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

      await experienceAPI.create(payload);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            Share Your Interview Experience
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Help your juniors prepare by documenting the recruitment timeline, interview questions, and placement offers.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Details Section */}
          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80 space-y-6">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
              General Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Infosys"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-650 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  CTC Offered (LPA) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 18.5"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-650 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Year of Interview *
                </label>
                <input
                  type="number"
                  required
                  min="2015"
                  max="2035"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Student Branch *
                </label>
                <select
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interview Rounds Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-200">
                Interview Rounds
              </h2>
              <button
                type="button"
                onClick={handleAddRound}
                className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 rounded-lg transition-colors"
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
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 sm:p-6 relative group"
                >
                  <div className="flex justify-between items-center gap-4 mb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Round {index + 1}
                    </span>
                    {rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRound(index)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Round Type *
                      </label>
                      <select
                        value={round.roundType}
                        onChange={(e) => handleRoundChange(index, 'roundType', e.target.value)}
                        className="w-full md:w-64 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-violet-500 transition-all text-sm"
                      >
                        {roundTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Questions Asked *
                      </label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Describe the coding questions, puzzle statements, or topics you were grilled on..."
                        value={round.questions}
                        onChange={(e) => handleRoundChange(index, 'questions', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-650 focus:outline-none focus:border-violet-500 transition-all text-sm resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Preparation Notes & Tips
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Share any key advice, links/resources, or strategies that helped you clear this round..."
                        value={round.notes}
                        onChange={(e) => handleRoundChange(index, 'notes', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-650 focus:outline-none focus:border-violet-500 transition-all text-sm resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="flex items-center gap-4 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-lg text-sm shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-95 transition-all flex items-center gap-2"
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

export default CreateExperience;