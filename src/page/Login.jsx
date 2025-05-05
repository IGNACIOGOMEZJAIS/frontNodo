import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { auth } from '../Service/api';

const schema = yup.object({
  email: yup.string().email('Formato de correo inválido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
  username: yup.string().when('isRegistering', {
    is: true,
    then: () => yup.string().required('El nombre de usuario es obligatorio'),
  }),
}).required();

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    context: { isRegistering }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      let response;

      if (isRegistering) {
        const registerData = {
          ...data,
          role: 'account_owner'
        };
        response = await auth.register(registerData);
        toast.success('¡Registro exitoso! Por favor inicia sesión.');
        setIsRegistering(false);
        reset();
        return;
      } else {
        response = await auth.login(data);
        login(response.data.token);
        toast.success('¡Inicio de sesión exitoso!');
        navigate('/profiles');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium">Nombre de usuario</label>
              <input
                type="text"
                {...register('username')}
                className={`w-full px-3 py-2 border rounded ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-3 py-2 border rounded ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-blue-600 hover:underline text-sm"
            >
              {isRegistering
                ? '¿Ya tienes una cuenta? Inicia sesión'
                : '¿No tienes una cuenta? Regístrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
