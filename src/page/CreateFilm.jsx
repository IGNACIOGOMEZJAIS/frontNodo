import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { movies } from '../Service/api';

const genres = [
  'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror',
  'Ciencia Ficción', 'Fantasía', 'Romance', 'Animación', 'Documental',
];

const schema = yup.object({
  title: yup.string().required('El título es obligatorio'),
  description: yup.string().required('La descripción es obligatoria'),
  genre: yup.string().oneOf(genres, 'Género inválido').required('El género es obligatorio'),
  rating: yup.string().required('La calificación es obligatoria'),
  posterUrl: yup.string().url('Debe ser una URL válida').required('La URL del póster es obligatoria'),
});

const CreateFilm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      movies.getById(id)
        .then((res) => {
          const data = res.data.data.movie;
          setValue('title', data.title);
          setValue('description', data.description);
          setValue('genre', Array.isArray(data.genre) ? data.genre[0].replace(/['"]+/g, '') : data.genre);
          setValue('rating', data.rating);
          setValue('posterUrl', data.posterUrl);
        })
        .catch(() => {
          toast.error('Error al cargar los datos de la película');
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await movies.update(id, data);
        toast.success('Película actualizada correctamente');
      } else {
        await movies.create(data);
        toast.success('Película creada correctamente');
      }
      reset();
      navigate('/catalog');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar la película';
      toast.error(msg);
    }
  };

  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
         <button
                   className="mb-6 text-indigo-600 hover:text-indigo-800 font-bold"
                onClick={() => navigate('/catalog')}
            >
                ← Volver a las películas
            </button>
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Editar Película' : 'Crear Película'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Título</label>
          <input {...register('title')} className="w-full border rounded px-3 py-2" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea {...register('description')} className="w-full border rounded px-3 py-2" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Género</label>
          <select {...register('genre')} className="w-full border rounded px-3 py-2">
            <option value="">Selecciona un género</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Calificación</label>
          <input {...register('rating')} className="w-full border rounded px-3 py-2" />
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>

        <div>
          <label className="block mb-1">URL del póster</label>
          <input {...register('posterUrl')} className="w-full border rounded px-3 py-2" />
          {errors.posterUrl && <p className="text-red-500 text-sm">{errors.posterUrl.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditing ? 'Actualizar Película' : 'Crear Película'}
        </button>
      </form>
    </div>
  );
};

export default CreateFilm;
