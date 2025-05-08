import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { profiles } from '../Service/api';
import Swal from 'sweetalert2';

const schema = yup.object({
  name: yup.string().required('Nombre requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
}).required();

const type = ['standard_profile', 'child_profile'];

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [userProfiles, setUserProfiles] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profiles.getMyprofile();
      setUserProfiles(response.data.data.profiles || []);
      if (!response.data.data.profiles.length) {
        toast.info('No se encontraron perfiles. Crea uno nuevo.');
      }
    } catch (error) {
      toast.error('No se pudieron cargar los perfiles.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (profile = null) => {
    setEditingProfile(profile);
    reset(profile || { name: '', type: 'standard_profile' });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    reset();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingProfile) {
        await profiles.update(editingProfile._id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await profiles.create(data);
        toast.success('Perfil creado correctamente');
      }
      handleCloseDialog();
      loadProfiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el perfil');
    } finally {
      setSubmitting(false);
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
      try {
        await profiles.delete(profileId);
        toast.success('Perfil eliminado correctamente');
        loadProfiles();
      } catch {
        toast.error('La eliminación del perfil falló');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center gap-2 text-blue-600 hover:underline"
          onClick={() => navigate('/profiles')}
        >
          ← Volver a perfiles
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          onClick={() => handleOpenDialog()}
        >
          Crear nuevo perfil
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userProfiles.map((profile) => (
            <div key={profile._id} className="bg-white border rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
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
              <p className="text-gray-500 capitalize">{profile.type}</p>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingProfile ? 'Editar perfil' : 'Crear nuevo perfil'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nombre</label>
                <input
                  className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name')}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Tipo de usuario</label>
                <select
                  className="w-full border p-2 rounded"
                  {...register('type')}
                >
                  <option value="">Selecciona un tipo</option>
                  {type.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : editingProfile ? 'Actualizar' : 'Crear'}
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
