import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { profiles } from '../Service/api';

const ProfileSelector = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const navigate = useNavigate();
  const { selectProfile } = useAuth();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profiles.getMyprofile(); // nuevo endpoint unificado
      const profilesData = response.data.data.profiles;

      if (profilesData.length === 1) {
        handleProfileSelect(profilesData[0]);
        return;
      }

      setUserProfiles(profilesData);
    } catch (error) {
      toast.error('Error al cargar los perfiles');
    }
  };

  const handleProfileSelect = (profile) => {
    selectProfile(profile);
    navigate('/catalog');
  };

  const getAvatarColor = (type) => {
    switch (type) {
      case 'child':
        return 'bg-green-500';
      case 'teen':
        return 'bg-blue-500';
      default:
        return 'bg-purple-600';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quien esta viendo?</h1>
        <button
          onClick={() => navigate('/profile-management')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ⚙️ Administrar perfiles
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {userProfiles.map((profile) => (
          <div
            key={profile._id}
            className="cursor-pointer transform transition-transform hover:scale-105 border rounded-lg shadow p-6 text-center"
            onClick={() => handleProfileSelect(profile)}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl ${getAvatarColor(
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
    </div>
  );
};

export default ProfileSelector;
