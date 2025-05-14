import React from 'react';
import { Navigate } from 'react-router-dom';

// Este es un ejemplo de cómo verificar si el usuario está autenticado.
const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false; // Ejemplo usando localStorage
};

const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
