import { createContext, useContext, useEffect, useState } from 'react';
import * as jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [decodedToken, setDecodedToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Token inválido o expirado');
        setDecodedToken(null);
      }
    }
  }, [token]);

  const selectProfile = (profile) => {
    setProfile(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        decodedToken,
        profile,
        selectProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
