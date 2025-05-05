import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../page/Login';
import ProfileSelector from '../page/ProfileSelector';
import MovieCatalog from '../page/MovieCatalog';
import Navbar from '../Components/Navbar';
import Favorites from '../page/Favorite';
import CreateFilm from '../page/CreateFilm';
import ProfileManagement from '../page/ProfileManagement';
import PrivateRoute from '../page/PrivateRoutes'; // Importamos el componente PrivateRoute

const AppRouter = () => {
  const location = useLocation();

  const hideNavbarOn = ['/']; // rutas sin Navbar
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/profiles' element={<ProfileSelector />} />

        {/* Rutas protegidas con PrivateRoute */}
        <Route 
          path='/catalog' 
          element={<PrivateRoute element={<MovieCatalog />} />} 
        />
        <Route 
          path='/create-movie' 
          element={<PrivateRoute element={<CreateFilm />} />} 
        />
        <Route 
          path="/edit-movie/:id" 
          element={<PrivateRoute element={<CreateFilm />} />} 
        />
        <Route 
          path='/profile-management' 
          element={<PrivateRoute element={<ProfileManagement />} />} 
        />
      </Routes>

      <Favorites />
    </>
  );
};

export default AppRouter;
