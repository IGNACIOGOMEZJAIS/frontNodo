import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { profiles } from '../Service/api';

const ProfileSelector = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { selectProfile, userRole } = useAuth();

  useEffect(() => {
    loadProfiles();
  }, []);


  const isOwner = userRole === '68123f3a4ac4061660a2d06b';

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
      case 'child_profile':
        return 'bg-green-500';
      case 'standard_profile':
        return 'bg-blue-500';
      default:
        return 'bg-purple-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">¿Quién está viendo?</h1>
        {isOwner && (
          <button
            onClick={() => navigate('/profile-management')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all"
          >
            ⚙️ Administrar perfiles
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {userProfiles.map((profile) => (
            <div
              key={profile._id}
              className="cursor-pointer transform transition hover:scale-105 bg-white border border-gray-200 rounded-xl shadow-lg p-6 text-center hover:shadow-xl"
              onClick={() => handleProfileSelect(profile)}
            >
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl shadow-inner ${getAvatarColor(
                  profile.type
                )}`}
              >
                👤
              </div>
              <h2 className="text-lg font-semibold mt-4">{profile.name}</h2>
              <p className="text-gray-500 capitalize text-sm">{profile.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
