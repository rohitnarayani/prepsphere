import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary rounded-b-none'
        : 'text-text-muted hover:bg-surface-card hover:text-text-primary'
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg-base/85 border-b border-border-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-[#8576E9] flex items-center justify-center shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-heading font-bold text-text-primary tracking-tight">
                Prep<span className="text-brand-primary">Sphere</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/" className={linkClass} end>
                Experiences Feed
              </NavLink>
              {user && (
                <NavLink to="/post" className={linkClass}>
                  Post Experience
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/post"
                  className="hidden sm:flex items-center gap-2 bg-brand-primary hover:bg-[#5b4cc4] text-white px-4.5 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-primary/10 active:scale-95 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Share Experience
                </Link>

                <div className="flex items-center gap-3.5 pl-3 border-l border-border-divider">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-text-primary">{user.name}</span>
                    <span className="text-[10px] text-text-muted">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-muted hover:text-red-450 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                    title="Log Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-surface-card hover:bg-[#1f232c] text-text-primary px-4.5 py-2 rounded-xl text-sm font-bold border border-border-divider transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex justify-around border-t border-border-divider bg-bg-base/90 py-2.5">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-[10px] font-semibold tracking-wide ${isActive ? 'text-brand-primary' : 'text-text-muted'}`} end>
          <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Experiences
        </NavLink>
        {user ? (
          <NavLink to="/post" className={({ isActive }) => `flex flex-col items-center text-[10px] font-semibold tracking-wide ${isActive ? 'text-brand-primary' : 'text-text-muted'}`}>
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Post Log
          </NavLink>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `flex flex-col items-center text-[10px] font-semibold tracking-wide ${isActive ? 'text-brand-primary' : 'text-text-muted'}`}>
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Log In
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
