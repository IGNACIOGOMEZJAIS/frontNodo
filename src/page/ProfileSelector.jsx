// src/pages/ProfileSelector.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { profiles } from '../Service/api';

const OWNER_ROLE_ID = '68123f3a4ac4061660a2d06b';

const ProfileSelector = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { selectProfile, decodedToken } = useAuth();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profiles.getMyprofile();
      setUserProfiles(response.data.data.profiles);
    } catch (error) {
      toast.error('Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile) => {
    selectProfile(profile);
    navigate('/catalog');
  };

  const getAvatarColor = (type) => {
    switch (type) {
      case 'child':
        return 'bg-green-400';
      case 'teen':
        return 'bg-blue-400';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-br from-gray-100 to-white">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">¿Quién está viendo?</h1>
          {decodedToken?.roleId === OWNER_ROLE_ID && (
            <button
              onClick={() => navigate('/profile-management')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              ⚙️ Administrar perfiles
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
            {userProfiles.map((profile) => (
              <div
                key={profile._id}
                className="cursor-pointer transform transition hover:scale-105 bg-white border border-gray-200 rounded-xl shadow p-4 text-center hover:shadow-lg"
                onClick={() => handleProfileSelect(profile)}
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl ${getAvatarColor(
                    profile.type
                  )}`}
                >
                  👤
                </div>
                <h2 className="text-lg font-semibold mt-4 text-gray-800">{profile.name}</h2>
                <p className="text-sm text-gray-500 capitalize">{profile.type.replace('_profile', '')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
