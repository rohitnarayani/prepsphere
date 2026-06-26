import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? 'bg-[#3FA9F5]/10 text-[#3FA9F5] border-b-2 border-[#3FA9F5] rounded-b-none'
        : 'text-text-muted hover:bg-surface-card hover:text-text-primary'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
      isActive
        ? 'bg-[#3FA9F5]/10 text-[#3FA9F5] border-l-4 border-[#3FA9F5] rounded-l-none'
        : 'text-text-muted hover:bg-surface-card hover:text-text-primary'
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg-base/85 border-b border-border-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
              <div className="w-9 h-9 rounded-xl bg-[#3FA9F5] flex items-center justify-center shadow-md shadow-[#3FA9F5]/20 group-hover:scale-105 group-hover:shadow-[#3FA9F5]/40 transition-all duration-300">
                <svg className="w-5.5 h-5.5 text-[#06141F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-heading font-extrabold text-text-primary tracking-tight group-hover:opacity-95 transition-opacity">
                Prep<span className="text-[#3FA9F5]">Sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
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

          {/* Desktop Auth and Session Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/post"
                  className="flex items-center gap-2 bg-[#3FA9F5] hover:bg-[#3FA9F5]/90 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#3FA9F5]/20 text-[#06141F] px-4.5 py-2 rounded-xl text-sm font-bold shadow-md shadow-[#3FA9F5]/10 active:scale-[0.98] transition-all duration-300"
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
                    className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200 cursor-pointer"
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
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm font-semibold transition-colors hover:scale-[1.02] active:scale-[0.98]"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#0C111C] hover:bg-[#070B14] text-text-primary px-4.5 py-2 rounded-xl text-sm font-bold border border-[#161E2E] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-card border border-border-divider focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Down Mobile Drawer Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-border-divider bg-bg-base/95 backdrop-blur-lg animate-fadeIn px-4 py-4 space-y-4">
          <div className="space-y-1">
            <NavLink
              to="/"
              className={mobileLinkClass}
              end
              onClick={() => setIsOpen(false)}
            >
              Experiences Feed
            </NavLink>
            {user && (
              <NavLink
                to="/post"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Post Experience
              </NavLink>
            )}
          </div>

          <div className="pt-4 border-t border-border-divider">
            {user ? (
              <div className="space-y-4">
                <div className="px-4 py-2 bg-surface-card border border-border-divider rounded-xl">
                  <span className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Signed In As</span>
                  <span className="block text-sm font-bold text-text-primary mt-0.5">{user.name}</span>
                  <span className="block text-[10px] text-text-muted mt-0.5">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2.5 rounded-xl border border-red-500/20 transition-all cursor-pointer text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center border border-border-divider text-text-muted hover:text-text-primary font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-[#3FA9F5] hover:bg-[#3FA9F5]/90 text-[#06141F] font-bold py-2.5 rounded-xl text-sm transition-all duration-300 text-center shadow-md shadow-[#3FA9F5]/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
