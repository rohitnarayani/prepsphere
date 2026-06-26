import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const ExperienceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosInstance.get(`/experiences/${id}`);
        setExperience(response.data);
      } catch (err) {
        setError('Failed to load experience details. The resource may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperienceDetails();
  }, [id]);

  const handleUpvote = async () => {
    if (!user) {
      alert('Please log in to upvote experiences.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/experiences/${experience.id}/upvote`, { userId: user.id });
      setExperience(response.data);
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await axiosInstance.post(`/experiences/${experience.id}/comment`, {
        userId: user.id,
        text: commentText.trim(),
      });
      setExperience(response.data);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to post comment. Try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] bg-bg-base text-text-primary">
        <svg className="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mt-4 text-text-muted text-sm font-semibold">Loading details...</span>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center bg-bg-base text-text-primary min-h-screen">
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 font-semibold">{error || 'Experience not found.'}</p>
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

  const isUpvotedByMe = user && experience.upvotes && experience.upvotes.includes(user.id);
  const upvoteCount = experience.upvotes ? experience.upvotes.length : 0;
  const commentCount = experience.comments ? experience.comments.length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 bg-bg-base min-h-screen text-text-primary">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-bold group cursor-pointer"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Feed
      </button>

      {/* Main Header */}
      <div className="backdrop-blur-xl bg-surface-card border border-border-divider p-8 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-wide">
                {experience.branch}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-bg-base text-text-muted">
                Class of {experience.year}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mt-3">
              {experience.companyName}
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              Interview Experience Log
            </p>
          </div>

          <div className="bg-bg-base border border-border-divider px-6 py-4 text-center min-w-[150px] rounded-2xl">
            <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Salary Package</span>
            <span className="text-3xl font-heading font-bold text-brand-secondary mt-1 block tabular-nums">
              {experience.ctc} <span className="text-sm font-semibold text-text-muted font-sans">LPA</span>
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 pt-6 border-t border-border-divider flex items-center justify-between">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl border text-sm font-bold transition-all active:scale-95 cursor-pointer ${
              isUpvotedByMe
                ? 'bg-brand-secondary text-bg-base border-brand-secondary shadow-md shadow-brand-secondary/10'
                : 'border-border-divider hover:bg-bg-base text-text-muted hover:text-text-primary'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isUpvotedByMe ? 'fill-bg-base' : 'currentColor'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{upvoteCount} Upvotes</span>
          </button>

          <span className="text-sm text-text-muted flex items-center gap-1.5 font-semibold">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {experience.rounds ? experience.rounds.length : 0} rounds total
          </span>
        </div>
      </div>

      {/* Rounds Log Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2 px-1">
          <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interview Process Timeline
        </h2>

        <div className="space-y-6">
          {experience.rounds && experience.rounds.map((round, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-border-divider rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border-divider pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-white">
                    {round.roundType} Round
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Questions Asked</h4>
                  <div className="bg-bg-base/70 p-5 rounded-xl border border-border-divider text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                    {round.questions}
                  </div>
                </div>

                {round.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Notes & Tips</h4>
                    <div className="bg-brand-primary/5 p-5 rounded-xl border border-brand-primary/10 text-brand-primary/95 text-sm leading-relaxed whitespace-pre-wrap">
                      {round.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion / Comments Section */}
      <div className="space-y-6 border-t border-border-divider pt-8">
        <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Discussion ({commentCount})
        </h2>

        {/* Comment input form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3.5">
            <textarea
              rows="3"
              placeholder="Ask a clarifying question or say thanks..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-3 bg-surface-card border border-border-divider rounded-xl text-text-primary placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 text-sm resize-y"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="bg-brand-primary hover:bg-[#5b4cc4] disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-md shadow-brand-primary/10 cursor-pointer"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-surface-card border border-border-divider text-center shadow-lg">
            <p className="text-sm text-text-muted">
              Want to join the conversation? Please{' '}
              <Link to="/login" className="text-brand-primary hover:text-[#5b4cc4] font-semibold underline">
                Log In
              </Link>{' '}
              to post a comment.
            </p>
          </div>
        )}

        {/* Comments Feed list */}
        <div className="space-y-4">
          {experience.comments && experience.comments.length > 0 ? (
            experience.comments.map((comment, index) => (
              <div
                key={index}
                className="bg-surface-card/60 p-5 border border-border-divider rounded-xl flex gap-4 items-start shadow-sm"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-800 flex items-center justify-center text-xs text-text-primary font-bold shrink-0 shadow-md">
                  {comment.userId ? comment.userId.slice(-2).toUpperCase() : 'PS'}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-text-primary">
                      Contributor {comment.userId ? comment.userId.slice(-4) : ''}
                    </span>
                    <span className="text-[10px] text-text-muted font-semibold bg-bg-base px-2 py-0.5 border border-border-divider rounded-md">
                      {comment.date ? new Date(comment.date).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary/90 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-text-muted py-8">
              No comments yet. Start the discussion!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
