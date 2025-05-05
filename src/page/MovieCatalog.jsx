import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { movies } from '../Service/api';
import { useFilm } from '../context/FilmContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MovieCatalog = () => {
    const { favorites, setFavorites, toggleFavorite } = useFilm();
    const [movieList, setMovieList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState(''); 
    const { currentProfile } = useAuth();
    const ITEMS_PER_PAGE = 12;
    const navigate = useNavigate();


    useEffect(() => {
        loadMovies();
    }, [page, search, genreFilter, currentProfile]);

    const loadMovies = async () => {
        try {
            const response = await movies.getAll({});
            setMovieList(response.data.data?.movies || []);
            setTotalPages(Math.ceil(response.data.data?.total / ITEMS_PER_PAGE) || 1);
        } catch (error) {
            toast.error('Failed to load movies');
            setMovieList([]);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 when search changes
    };

    const handleGenreChange = (e) => {
        setGenreFilter(e.target.value);
        setPage(1); // Reset to page 1 when genre filter changes
    };

    const onRemoveFilm = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la película permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await movies.delete(id);
                toast.success('Película eliminada correctamente');
                loadMovies();
            } catch (error) {
                const msg = error.response?.data?.message || 'Error al eliminar la película';
                toast.error(msg);
            }
        }
    };

    return (
        <div className="p-6">
            <button
                className="flex items-center gap-2 text-blue-600 hover:underline"
                onClick={() => navigate('/profiles')}
            >
                ← Volver a la selección de perfiles
            </button>
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="🔍 Buscar películas..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mt-4">
                    <select
                        value={genreFilter}
                        onChange={handleGenreChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar género</option>
                        <option value="acción">Acción</option>
                        <option value="comedia">Comedia</option>
                        <option value="drama">Drama</option>
                        <option value="ciencia ficción">Ciencia Ficción</option>
                        <option value="terror">Terror</option>
                        {/* Puedes añadir más géneros aquí */}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.isArray(movieList) &&
                    movieList
                        .filter(movie => {
                            const isAllowed =
                                currentProfile?.type === 'owner' ||
                                currentProfile?.role?._id === '68123f3a4ac4061660a2d06b';
                            if (!isAllowed && movie.genre?.toLowerCase() === 'acción') {
                                return false;
                            }
                            // Filtrar por nombre
                            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
                            // Filtrar solo por el primer género si hay un filtro seleccionado
                            const matchesGenre = genreFilter ? movie.genre?.toLowerCase() === genreFilter.toLowerCase() : true;
                            return matchesSearch && matchesGenre;
                        })
                        .map((movie) => {
                            const rating = movie.rating || 0;
                            const filledStars = Math.max(0, Math.min(5, Math.floor(rating)));
                            const emptyStars = 5 - filledStars;

                            return (
                                <div key={movie._id} className="border rounded-lg shadow overflow-hidden">
                                    <img
                                        src={movie.posterUrl || '/placeholder.jpg'}
                                        alt={movie.title}
                                        onError={(e) => (e.target.src = '/placeholder.jpg')}
                                        className="w-full h-[300px] object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                                        <div className="mt-1 text-yellow-500">
                                            {'★'.repeat(filledStars)}
                                            {'☆'.repeat(emptyStars)}
                                        </div>
                                        <div className="p-4">
                                            <button
                                                onClick={() => onRemoveFilm(movie._id)}
                                                className="btn btn-sm btn-danger bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <Link
                                                to={`/edit-movie/${movie._id}`}
                                                className="btn btn-sm btn-warning bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Editar
                                            </Link>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <button
                                                onClick={() => toggleFavorite(movie)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {favorites.some(fav => fav._id === movie._id)
                                                    ? 'Quitar de ver más tarde'
                                                    : 'Agregar para ver más tarde'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded ${page === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    } hover:bg-blue-500 hover:text-white transition`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCatalog; // Aquí se exporta el componente correctamente
