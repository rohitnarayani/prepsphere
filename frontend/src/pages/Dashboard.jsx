/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('company') || '');
  const [collegeFilter, setCollegeFilter] = useState(searchParams.get('college') || '');
  const [branchFilter, setBranchFilter] = useState(searchParams.get('branch') || '');
  const [minCtc, setMinCtc] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [expRes, compRes] = await Promise.all([
        axiosInstance.get('/experiences'),
        axiosInstance.get('/companies'),
      ]);
      setExperiences(expRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Sync filters from URL search params if any
    const companyParam = searchParams.get('company');
    const branchParam = searchParams.get('branch');
    const collegeParam = searchParams.get('college');
    const timer = setTimeout(() => {
      if (companyParam !== null) setSearch(companyParam);
      if (branchParam !== null) setBranchFilter(branchParam);
      if (collegeParam !== null) setCollegeFilter(collegeParam);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpvote = async (id, e) => {
    e.preventDefault(); // Prevent navigating if card was clicked
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

  // Filter experiences based on search/college/branch/ctc
  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = exp.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesCollege = collegeFilter
      ? (exp.collegeName || '').toLowerCase().includes(collegeFilter.toLowerCase())
      : true;
    const matchesBranch = branchFilter ? exp.branch === branchFilter : true;
    const matchesCtc = minCtc ? exp.ctc >= parseFloat(minCtc) : true;
    return matchesSearch && matchesCollege && matchesBranch && matchesCtc;
  });

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-bg-base min-h-screen text-text-primary">
      {/* Banner Section */}
      <div className="relative rounded-2xl overflow-hidden bg-surface-card border border-border-divider p-8 sm:p-10 mb-8 shadow-xl hover:border-[#3FA9F5]/20 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3FA9F5]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3FE0C8]/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary tracking-tight">
              Prep<span className="text-[#3FA9F5]">Sphere</span> Feed
            </h1>
            <p className="mt-3 text-[#7587A3] max-w-xl text-sm leading-relaxed font-medium">
              Read interview questions, preparation tips, and placement reviews shared directly by your classmates.
            </p>
          </div>
          {user && (
            <Link
              to="/post"
              className="bg-[#3FA9F5] hover:bg-[#3FA9F5]/90 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#3FA9F5]/20 text-[#06141F] px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md shadow-[#3FA9F5]/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Share Experience
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-4 text-text-muted text-sm font-semibold">Loading PrepSphere feed...</span>
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/20 text-center max-w-2xl mx-auto">
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-none">
            {/* Filter controls */}
            <div className="bg-[#0C111C] border border-[#161E2E] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#3FA9F5]/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-extrabold text-[#E7ECF7] flex items-center gap-2 tracking-tight">
                  <svg className="w-5 h-5 text-[#3FA9F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                  </svg>
                  Filters
                </h2>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden p-1.5 rounded-lg border border-[#161E2E] text-text-muted hover:text-text-primary hover:bg-[#070B14]/80 transition-colors cursor-pointer"
                  aria-label="Toggle filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {showMobileFilters ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                </button>
              </div>

              <div className={`mt-5 space-y-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Company</label>
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C111C] border border-[#161E2E] rounded-xl text-[#E7ECF7] placeholder-[#7587A3] focus:outline-none focus:ring-2 focus:ring-[#3FA9F5]/50 focus:border-[#3FA9F5] text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">College</label>
                  <input
                    type="text"
                    placeholder="Search college..."
                    value={collegeFilter}
                    onChange={(e) => setCollegeFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C111C] border border-[#161E2E] rounded-xl text-[#E7ECF7] placeholder-[#7587A3] focus:outline-none focus:ring-2 focus:ring-[#3FA9F5]/50 focus:border-[#3FA9F5] text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Branch</label>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C111C] border border-[#161E2E] rounded-xl text-[#E7ECF7] focus:outline-none focus:ring-2 focus:ring-[#3FA9F5]/50 focus:border-[#3FA9F5] text-sm transition-all"
                  >
                    <option value="">All Branches</option>
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Min CTC (LPA)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={minCtc}
                    onChange={(e) => setMinCtc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0C111C] border border-[#161E2E] rounded-xl text-[#E7ECF7] placeholder-[#7587A3] focus:outline-none focus:ring-2 focus:ring-[#3FA9F5]/50 focus:border-[#3FA9F5] text-sm transition-all"
                  />
                </div>

                <button
                  onClick={() => {
                    setSearch('');
                    setCollegeFilter('');
                    setBranchFilter('');
                    setMinCtc('');
                    setSearchParams({});
                  }}
                  className="w-full border border-[#161E2E] hover:bg-[#070B14] text-text-muted hover:text-text-primary font-bold py-2.5 rounded-xl text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Visited Companies List */}
            <div className="bg-[#0C111C] border border-[#161E2E] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#3FA9F5]/20 transition-all duration-300">
              <h2 className="text-lg font-heading font-extrabold text-[#E7ECF7] mb-5 flex items-center gap-2 tracking-tight">
                <svg className="w-5 h-5 text-[#3FE0C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Visited Companies
              </h2>
              {companies.length === 0 ? (
                <p className="text-xs text-text-muted">No company listings yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {companies.map((c) => (
                    <Link
                      key={c.companyName}
                      to={`/company/${encodeURIComponent(c.companyName)}`}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#070B14]/80 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                    >
                      <span className="text-slate-350 font-medium">{c.companyName}</span>
                      <span className="text-xs text-text-muted font-bold bg-[#070B14] border border-[#161E2E] px-2.5 py-0.5 rounded-lg">
                        {c.totalPosts}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Logs Feed */}
          <div className="lg:col-span-3 space-y-5 order-1 lg:order-none">
            {filteredExperiences.length === 0 ? (
              <div className="bg-[#0C111C] border border-[#161E2E] border-l-4 border-l-[#5C7CFA] rounded-l-none rounded-r-lg p-16 text-center shadow-lg">
                <svg className="w-16 h-16 text-gray-650 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2" />
                </svg>
                <h3 className="text-xl font-heading font-bold text-[#E7ECF7]">No placements found</h3>
                <p className="mt-2 text-[#7587A3] max-w-sm mx-auto text-sm">
                  Be the first to share an experience under these filter criteria.
                </p>
                {user && (
                  <Link
                    to="/post"
                    className="mt-6 inline-block bg-[#3FA9F5] hover:bg-[#3FA9F5]/90 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#3FA9F5]/20 text-[#06141F] font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-md shadow-[#3FA9F5]/10"
                  >
                    Post Placement Log
                  </Link>
                )}
              </div>
            ) : (
              filteredExperiences.map((exp) => {
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
                          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#E7ECF7] group-hover:text-[#3FA9F5] transition-colors tracking-tight">
                            {exp.companyName}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3FA9F5]/15 text-[#3FA9F5] border border-[#3FA9F5]/20 uppercase tracking-wider shadow-inner animate-fadeIn">
                            {exp.branch}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3FE0C8]/15 text-[#3FE0C8] border border-[#3FE0C8]/20 uppercase tracking-wider shadow-inner animate-fadeIn">
                            Class of {exp.year}
                          </span>
                        </div>
                        <p className="text-xs text-[#7587A3] mt-2 font-medium">
                          {exp.collegeName ? `visited ${exp.collegeName}` : 'Placement Interview Log'}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-2xl sm:text-3xl font-heading font-extrabold text-[#3FE0C8] tracking-tight tabular-nums">
                          {exp.ctc} <span className="text-sm font-semibold text-[#7587A3] font-sans">LPA</span>
                        </span>
                      </div>
                    </div>

                    {/* Rounds list summary */}
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

                    {/* Action Bar */}
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
                          <svg className="w-4 h-4 text-gray-550" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      )}
    </div>
  );
};

export default Dashboard;
