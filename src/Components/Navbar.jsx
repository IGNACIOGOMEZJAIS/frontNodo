import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardPlus, CheckCircle2, Menu, X } from 'lucide-react';
import { FcFilmReel } from 'react-icons/fc';
import { IoIosLogOut } from 'react-icons/io';
import { useAuth } from '../context/AuthContext';
import { useFilm } from '../context/FilmContext';
import useWeather from '../CustomHock/UseWather';

const ADMIN_ROLE_ID = '68123f3a4ac4061660a2d06b';

const Navbar = () => {
  const { logout, userRole, currentProfile } = useAuth();
  const { open } = useFilm();
  const { weather, loading, error } = useWeather();
  const [menuOpen, setMenuOpen] = useState(false);

  // Todos los hooks deben llamarse antes de cualquier return
  useEffect(() => {
    if (currentProfile) {
      console.log('Perfil actual:', currentProfile);
    }
  }, [currentProfile]);

  // No renderizar si no hay perfil seleccionado
  if (!currentProfile || Object.keys(currentProfile).length === 0) {
    return null;
  }


  
  const isAdmin = userRole === ADMIN_ROLE_ID;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <span className="text-xl font-semibold tracking-wide">NodoFlix</span>
          <FcFilmReel className="w-6 h-6" />
        </div>

        {/* Menú hamburguesa (solo mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navegación principal (desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Opciones de administrador */}
          {isAdmin && (
            <Link
              to="/create-movie"
              className="flex items-center gap-1 hover:text-green-400 transition"
            >
              <ClipboardPlus className="w-5 h-5" />
              <span>Crear Película</span>
            </Link>
          )}

          {/* Opciones comunes */}
          <Link
            to="/catalog"
            className="flex items-center gap-1 hover:text-green-400 transition"
          >
            <ClipboardPlus className="w-5 h-5" />
            <span>Catálogo</span>
          </Link>

          <button
            onClick={open}
            className="flex items-center gap-1 hover:text-green-400 transition"
          >
            <FcFilmReel className="w-5 h-5" />
            <span>Ver más tarde</span>
          </button>

          {/* Clima */}
          <div className="text-sm text-gray-300 ml-2">
            {loading ? (
              <span>Cargando clima...</span>
            ) : error ? (
              <span>{error}</span>
            ) : weather?.current_weather ? (
              <span>Ideal para una peli!
                {weather.current_weather.temperature}°C - {weather.current_weather.windspeed} km/h
              </span>
            ) : (
              <span>Clima no disponible</span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1 hover:text-red-400 transition"
          >
            <span>Logout</span>
            <IoIosLogOut />
          </button>
        </nav>

        {/* Menú móvil (solo cuando está abierto) */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 px-6 py-4 space-y-4">
            {isAdmin && (
              <Link
                to="/create-movie"
                onClick={closeMenu}
                className="flex items-center gap-1 hover:text-green-400 transition block"
              >
                <ClipboardPlus className="w-5 h-5" />
                <span>Crear Película</span>
              </Link>
            )}

            <Link
              to="/catalog"
              onClick={closeMenu}
              className="flex items-center gap-1 hover:text-green-400 transition block"
            >
              <ClipboardPlus className="w-5 h-5" />
              <span>Catálogo</span>
            </Link>

            <button
              onClick={() => {
                open();
                closeMenu();
              }}
              className="flex items-center gap-1 hover:text-green-400 transition w-full text-left"
            >
              <FcFilmReel className="w-5 h-5" />
              <span>Ver más tarde</span>
            </button>

            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="flex items-center gap-1 hover:text-red-400 transition w-full text-left"
            >
              <span>Logout</span>
              <IoIosLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;