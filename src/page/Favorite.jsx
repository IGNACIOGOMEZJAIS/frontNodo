import React from "react";
import { useFilm } from "../context/FilmContext";

const Favorites = () => {
  const { favorites, toggleFavorite, close, isModalOpen } = useFilm();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={close}
    >
      <div
        className="bg-white text-black border-gray-300 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] shadow-2xl border overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold text-center mb-4">
          {favorites.length === 0 ? (
            <p className="text-gray-600 text-center">No tienes películas favoritas</p>
          ) : (
            <p className="text-gray-600 text-center">Tus películas favoritas</p>
          )}
        </h2>

        <div className="space-y-4">
          {favorites.map((film) => (
            <div
              key={film._id}
              className="flex items-center rounded-lg shadow-md p-4 space-x-4 border bg-gray-100 border-gray-300"
            >
              <img
                src={film.posterUrl}
                alt={film.title}
                className="w-20 h-28 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{film.title}</h3>
              </div>

              <button
                onClick={() => toggleFavorite(film)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-semibold"
              >
                <i className="ph ph-heart-break"></i> Quitar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
