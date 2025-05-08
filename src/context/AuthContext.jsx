import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode'; // Importación corregida

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [decodedToken, setDecodedToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token); // Usando jwt_decode en lugar de jwtDecode
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
