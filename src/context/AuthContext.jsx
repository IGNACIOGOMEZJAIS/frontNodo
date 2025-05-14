import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Función para decodificar el token JWT
const parseJwt = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentProfile, setCurrentProfile] = useState(JSON.parse(localStorage.getItem('currentProfile')));
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const payload = parseJwt(token);
      setUserRole(payload?.role);
    } else {
      localStorage.removeItem('token');
      setUserRole(null);
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
 const removeProfile = () => {
  setCurrentProfile(null); // asegurate de que esto esté en el AuthContext
  localStorage.removeItem('currentProfile'); // si lo estás usando
};

  const logout = () => {
    setToken(null);
    setCurrentProfile(null);
    localStorage.removeItem('currentProfile');

    navigate("/");
  };

  const selectProfile = (profile) => {
    setCurrentProfile(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        currentProfile,
        selectProfile,
        userRole,
        removeProfile // lo exponemos acá
      }}
    >
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
