import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { movies } from '../Service/api';
import { useFilm } from '../context/FilmContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 4;

const MovieCatalog = () => {
  const { favorites, toggleFavorite } = useFilm();
  const [movieList, setMovieList] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentProfile, removeProfile } = useAuth();
  const navigate = useNavigate();

  const isOwner = currentProfile?.type === 'account_owner';
  const isAdult = ['account_owner', 'standard_profile'].includes(currentProfile?.type);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (currentProfile) {
      const filtered = filterMovies(movieList);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)));
      setPage(prev => Math.min(prev, totalPages));
    }
  }, [movieList, search, genreFilter, currentProfile, totalPages]);

  const loadMovies = async () => {
    try {
      const response = await movies.getAll({ limit: 0 });
      setMovieList(response.data.data?.movies || []);
    } catch {
      toast.error('Error al cargar las películas');
      setMovieList([]);
    }
  };

  const filterMovies = list =>
    list.filter(movie => {
      const genre = (movie.genre || '').trim().toLowerCase();
      if (!isAdult && ['acción', 'romance', 'terror','comedia'].includes(genre)) return false;
      const matchesSearch = movie.title?.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter
        ? genre === genreFilter.trim().toLowerCase()
        : true;
      return matchesSearch && matchesGenre;
    });

  const handleSearchChange = e => { setSearch(e.target.value); setPage(1); };
  const handleGenreChange = e => { setGenreFilter(e.target.value); setPage(1); };

  const onRemoveFilm = async id => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la película.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
      try {
        await movies.delete(id);
        toast.success('Película eliminada');
        loadMovies();
      } catch {
        toast.error('Error eliminando película');
      }
    }
  };

  const filteredMovies = filterMovies(movieList);
  const paginatedMovies = filteredMovies.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      <button
        onClick={() => { removeProfile(); navigate('/profiles'); }}
        className="mb-6 text-indigo-600 hover:text-indigo-800 font-bold"
      >
        ← Volver a perfiles
      </button>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={search}
          onChange={handleSearchChange}
          className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
        />
        <select
          value={genreFilter}
          onChange={handleGenreChange}
          className="w-48 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm"
        >
          <option value="">Todos los géneros</option>
          <option value="acción">Acción</option>
          <option value="comedia">Comedia</option>
          <option value="drama">Drama</option>
          <option value="ciencia ficción">Ciencia Ficción</option>
          <option value="terror">Terror</option>
          <option value="animación">Animación</option>
          <option value="musical">Musical</option>
          <option value="romance">Romance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {paginatedMovies.map(movie => {
          const rating = Math.round(movie.rating || 0);
          const stars = Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
          ));
          return (
            <div key={movie.title} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition">
              <div className="h-64 bg-gray-50 flex items-center justify-center">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={e => (e.target.src = '/placeholder.jpg')}
                  className="max-h-full object-contain"
                />
              </div>
              <div className="p-6 flex flex-col h-72">
                <h3 className="text-xl font-extrabold truncate mb-2">{movie.title}</h3>
                <div className="flex items-center mb-3">{stars}</div>
                <p className="text-gray-600 text-sm flex-1 mb-4 overflow-ellipsis line-clamp-3">{movie.description}</p>
                <div className="flex gap-3">
                  {isOwner && (
                    <>
                      <button
                        onClick={() => onRemoveFilm(movie._id)}
                        className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                      >Eliminar</button>
                      <Link
                        to={`/edit-movie/${movie._id}`}
                        className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center transition"
                      >Editar</Link>
                    </>
                  )}
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className="ml-auto text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {favorites.some(f => f._id === movie._id) ? 'Quitar favorito' : 'Favorito'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-5 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-indigo-500 transition"
          >Anterior</button>
          <span className="text-lg font-bold">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-5 py-2 bg-white border-2 border-gray-200 rounded-full hover:border-indigo-500 transition"
          >Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default MovieCatalog;
