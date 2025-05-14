import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { profiles } from '../Service/api';
import Swal from 'sweetalert2';
import { Puff } from 'react-loader-spinner';
import ClipLoader from 'react-spinners/ClipLoader';

const schema = yup.object({
  name: yup.string().required('Nombre requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  username: yup.string().required('Usuario requerido'),
  password: yup.string().required('Contraseña requerida'),
  type: yup.string().required('Tipo requerido'),
}).required();

const typeCreate = ['standard_profile', 'child_profile'];
const typeEdit = ['standard_profile', 'child_profile'];

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [userProfiles, setUserProfiles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const response = await profiles.getMyprofile();
      setUserProfiles(response.data.data.profiles || []);
      if (response.data.data.profiles.length === 0) {
        toast.info('No se encontraron perfiles. Crea uno nuevo.');
      }
    } catch (error) {
      toast.error('Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (profile = null) => {
    setEditingProfile(profile);
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email ?? '',
        username: profile.name || '',
        password: '',
        type: profile.type || 'standard_profile',
      });
    } else {
      reset({
        name: '',
        email: '',
        username: '',
        password: '',
        type: 'standard_profile',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingProfile) {
        await profiles.update(editingProfile._id, data);
        toast.success('Perfil actualizado correctamente');
      } else {
        await profiles.create(data);
        toast.success('Perfil creado correctamente');
      }
      handleCloseDialog();
      loadProfiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el perfil permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await profiles.delete(profileId);
        toast.success('Perfil eliminado correctamente');
        loadProfiles();
      } catch (error) {
        toast.error('Error al eliminar el perfil');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <button
          className="flex items-center gap-2 text-blue-600 hover:underline"
          onClick={() => navigate('/profiles')}
        >
          ← Volver a la selección de perfiles
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleOpenDialog()}
        >
          Crear nuevo perfil
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Puff height="80" width="80" color="#4fa94d" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userProfiles.map((profile) => (
            <div key={profile._id} className="border rounded shadow p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenDialog(profile)} className="text-blue-600 hover:text-blue-800">
                    ✎
                  </button>
                  <button onClick={() => handleDelete(profile._id)} className="text-red-600 hover:text-red-800">
                    🗑
                  </button>
                </div>
              </div>
              <p className="text-gray-600 capitalize">{profile.type}</p>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingProfile ? 'Editar perfil' : 'Crear nuevo perfil'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  type="email"
                  {...register('email')}
                   readOnly={!!editingProfile}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Usuario</label>
                <input
                  className={`w-full border p-2 rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('username')}
                  readOnly={!!editingProfile}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Contraseña</label>
                <input
                  className={`w-full border p-2 rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  type="password"
                  {...register('password')}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Nombre</label>
                <input
                  className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name')}
                  readOnly={!!editingProfile}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Tipo de usuario</label>
                <select
                  className={`w-full border p-2 rounded ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('type')}
                >
                  <option value="">Selecciona un tipo</option>
                  {(editingProfile ? typeEdit : typeCreate).map((typeOption) => (
                    <option key={typeOption} value={typeOption}>
                      {typeOption}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCloseDialog}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" />
                      <span className="ml-2">Cargando…</span>
                    </>
                  ) : editingProfile ? (
                    'Actualizar perfil'
                  ) : (
                    'Crear perfil'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
