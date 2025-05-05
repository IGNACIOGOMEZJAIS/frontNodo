import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FilmContext = createContext();
export const useFilm = () => useContext(FilmContext);

export const FilmProvider = ({ children }) => {
  const { currentProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentProfile?._id) {
      const saved = localStorage.getItem(`filmFavorites-${currentProfile._id}`);
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [currentProfile]);

  useEffect(() => {
    if (currentProfile?._id) {
      localStorage.setItem(`filmFavorites-${currentProfile._id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentProfile]);

  const toggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((fav) => fav._id === movie._id);
      return exists
        ? prevFavorites.filter((fav) => fav._id !== movie._id)
        : [...prevFavorites, movie];
    });
  };

  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);

  return (
    <FilmContext.Provider
      value={{
        toggleFavorite,
        favorites,
        setFavorites,
        isModalOpen,
        open,
        close,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
