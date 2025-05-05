import React from 'react';
import { ClipboardPlus,CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FcFilmReel } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { useFilm } from '../context/FilmContext';
import { IoIosLogOut } from 'react-icons/io';
import useWeather from '../CustomHock/UseWather';

const Navbar = () => {
  const { logout } = useAuth();
  const { open, close } = useFilm();
  const { weather, loading, error } = useWeather();

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <span className="text-xl font-semibold tracking-wide">NodoFlix</span>
          <FcFilmReel />
          <span className="text-sm text-gray-400">Tu cine en casa</span>
        </div>
        

        <nav className="flex space-x-6 text-sm md:text-base">
          <Link
            to="/create-movie"
            className="flex items-center space-x-1 hover:text-green-400 transition"
          >
            <ClipboardPlus className="w-5 h-5" />
            <span>Crear Pelicula</span>
          </Link>
          <Link
            to="/catalog"
            className="flex items-center space-x-1 hover:text-green-400 transition"
          >
            <ClipboardPlus className="w-5 h-5" />
            <span>Catalogo</span>
          </Link>

          <button
            onClick={open}
            className="flex items-center space-x-1 hover:text-green-400 transition"
          >
            <FcFilmReel className="w-5 h-5" />
            <span>Ver más tarde</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-1 hover:text-green-400 transition"
          >
            <span>Logout</span>
            <IoIosLogOut />
          </button>
        </nav>

     
        <div className="text-sm text-gray-300">
          {loading ? (
            <span>Cargando clima...</span>
          ) : error ? (
            <span>{error}</span>
          ) : (
            weather && weather.current_weather ? (
              <span>
                {weather.current_weather.temperature}°C - {weather.current_weather.windspeed} km/h
              </span>
            ) : (
              <span>Clima no disponible</span>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
