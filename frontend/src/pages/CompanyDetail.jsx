import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const CompanyDetail = () => {
  const { name } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, expRes] = await Promise.all([
          axiosInstance.get(`/companies/${encodeURIComponent(name)}`),
          axiosInstance.get(`/experiences/company/${encodeURIComponent(name)}`),
        ]);
        setStats(statsRes.data);
        setExperiences(expRes.data);
      } catch (err) {
        setError('Failed to fetch details for this company. Please ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, [name]);

  const handleUpvote = async (id, e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to upvote experiences.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/experiences/${id}/upvote`, { userId: user.id });
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? response.data : exp))
      );
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] bg-bg-base text-text-primary">
        <svg className="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mt-4 text-text-muted text-sm font-semibold">Loading company stats...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-bg-base text-text-primary min-h-screen">
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 font-semibold">{error || 'Company stats not found.'}</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-surface-card hover:bg-[#1f232c] text-text-primary font-bold px-5 py-2.5 rounded-xl text-sm transition-colors border border-border-divider"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-bg-base min-h-screen text-text-primary">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-bold group cursor-pointer"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0C111C] border border-[#161E2E] border-l-4 border-l-[#5C7CFA] p-5 sm:p-8 md:p-10 rounded-l-none rounded-r-lg shadow-xl hover:border-[#3FA9F5]/20 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3FA9F5]/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#E7ECF7] tracking-tight">
              {stats.companyName}
            </h1>
            <p className="mt-3 text-[#7587A3] text-sm max-w-xl leading-relaxed font-medium">
              Placement frequency, interview packages, and student shared experiences.
            </p>
          </div>
          {user && (
            <Link
              to="/post"
              className="bg-[#3FA9F5] hover:bg-[#3FA9F5]/90 text-[#06141F] font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full md:w-auto shadow-md shadow-[#3FA9F5]/10 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              I Interviewed Here
            </Link>
          )}
        </div>

        {/* Stats Metrics Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mt-10 pt-8 border-t border-[#161E2E] animate-fadeIn">
          <div className="text-center md:text-left pb-4 md:pb-0 border-b md:border-b-0 border-[#161E2E]">
            <span className="block text-xs font-semibold text-[#7587A3] uppercase tracking-wider">Experiences Shared</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#E7ECF7] mt-1.5 block">{stats.totalPosts}</span>
          </div>
          <div className="text-center md:text-left pb-4 md:pb-0 border-b md:border-b-0 md:border-x border-[#161E2E] px-0 md:px-4">
            <span className="block text-xs font-semibold text-[#7587A3] uppercase tracking-wider">Average Package</span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-[#3FE0C8] mt-1.5 block">{stats.avgCTC.toFixed(1)} LPA</span>
          </div>
          <div className="text-center md:text-left pt-2 md:pt-0 pl-0 md:pl-4">
            <span className="block text-xs font-semibold text-[#7587A3] uppercase tracking-wider mb-2 md:mb-0">Visits Logged</span>
            <div className="flex gap-1.5 mt-1.5 justify-center md:justify-start flex-wrap">
              {stats.years && stats.years.map((y) => (
                <span key={y} className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#3FA9F5]/15 text-[#3FA9F5] border border-[#3FA9F5]/20 font-bold animate-pulse-subtle">
                  {y}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Feed list */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-text-primary px-1 tracking-tight">
          Placement logs for {stats.companyName}
        </h2>

        <div className="space-y-5">
          {experiences.length === 0 ? (
            <div className="bg-[#0C111C] border border-[#161E2E] rounded-2xl p-16 text-center shadow-lg">
              <p className="text-[#7587A3] text-sm">No student has shared an interview log for this company yet.</p>
            </div>
          ) : (
            experiences.map((exp) => {
              const isUpvotedByMe = user && exp.upvotes && exp.upvotes.includes(user.id);
              const upvoteCount = exp.upvotes ? exp.upvotes.length : 0;
              const commentCount = exp.comments ? exp.comments.length : 0;
              const roundsCount = exp.rounds ? exp.rounds.length : 0;

              return (
                <Link
                  key={exp.id}
                  to={`/experience/${exp.id}`}
                  className="block bg-[#0C111C] border border-[#161E2E] border-l-4 border-l-[#5C7CFA] rounded-l-none rounded-r-lg p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-[#3FA9F5]/10 hover:border-[#3FA9F5]/30 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3FA9F5]/15 text-[#3FA9F5] border border-[#3FA9F5]/20 uppercase tracking-wider shadow-inner animate-fadeIn">
                          {exp.branch}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3FE0C8]/15 text-[#3FE0C8] border border-[#3FE0C8]/20 uppercase tracking-wider shadow-inner animate-fadeIn">
                          Class of {exp.year}
                        </span>
                      </div>
                      <p className="text-xs text-[#7587A3] mt-2 font-medium">
                        {exp.collegeName ? `visited ${exp.collegeName}` : 'Shared by Student Candidate'}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-2xl sm:text-3xl font-heading font-extrabold text-[#3FE0C8] tracking-tight tabular-nums">
                        {exp.ctc} <span className="text-sm font-semibold text-[#7587A3] font-sans">LPA</span>
                      </span>
                    </div>
                  </div>

                  {/* Rounds details summary */}
                  <div className="mt-5 flex gap-2.5 flex-wrap">
                    {exp.rounds && exp.rounds.map((round, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-xs bg-[#3FE0C8]/15 border border-[#3FE0C8]/20 rounded-full text-[#3FE0C8] flex items-center gap-1.5 transition-colors duration-250 hover:bg-[#3FE0C8]/25"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3FE0C8] shadow-sm animate-pulse"></span>
                        {round.roundType}
                      </span>
                    ))}
                  </div>

                  {/* Feed Actions */}
                  <div className="mt-6 pt-5 border-t border-[#161E2E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[#7587A3] text-sm">
                    <div className="flex items-center gap-4">
                      {/* Upvote Button with scale animation */}
                      <button
                        onClick={(e) => handleUpvote(exp.id, e)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                          isUpvotedByMe
                            ? 'bg-[#3FE0C8] text-[#06141F] border-[#3FE0C8] shadow-md shadow-[#3FE0C8]/20'
                            : 'border-[#161E2E] hover:bg-[#070B14] hover:text-text-primary'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${isUpvotedByMe ? 'fill-[#06141F] text-[#06141F]' : 'currentColor'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{upvoteCount} Upvotes</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-[#7587A3]">
                        <svg className="w-4 h-4 text-gray-555" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{commentCount} comments</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#3FA9F5] hover:text-[#3FA9F5]/80 group-hover:translate-x-1 transition-all duration-200 font-bold text-xs uppercase tracking-wider self-start sm:self-auto">
                      <span>Read Rounds ({roundsCount})</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
