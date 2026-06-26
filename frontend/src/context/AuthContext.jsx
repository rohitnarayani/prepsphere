/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('prepsphere_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('prepsphere_user');
      }
    }
    return null;
  });

  const login = (userData) => {
    // userData contains { id, name, email }
    const parsedUser = {
      id: userData.userId || userData.id,
      name: userData.name,
      email: userData.email,
    };
    localStorage.setItem('prepsphere_user', JSON.stringify(parsedUser));
    setUser(parsedUser);
  };

  const logout = () => {
    localStorage.removeItem('prepsphere_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
