import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentProfile, setCurrentProfile] = useState(JSON.parse(localStorage.getItem('currentProfile')));
  const navigate = useNavigate();


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    } else {
      localStorage.removeItem('currentProfile');
    }
  }, [currentProfile]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setCurrentProfile(null);
    navigate("/");
  };

  const selectProfile = (profile) => {
    setCurrentProfile(profile);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, currentProfile, selectProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
