import React, { useState, useRef } from 'react';
import { Heatmap } from '../components/Heatmap';

// Initial dummy data for the profile
const initialProfile = {
  name: 'Himanshu',
  rank: 123,
  points: 1850,
  problemsSolved: 256,
  contestsAttended: 42,
  avatarUrl: `https://via.placeholder.com/128/808080/FFFFFF?text=Avatar`,
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg text-center">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

export function ProfileView() {
  const [userProfile, setUserProfile] = useState(initialProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // To prevent memory leaks, revoke the old blob URL if it exists
      if (userProfile.avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(userProfile.avatarUrl);
      }
      const newAvatarUrl = URL.createObjectURL(file);
      setUserProfile(prevProfile => ({
        ...prevProfile,
        avatarUrl: newAvatarUrl,
      }));
    }
  };

  const handleUpdateAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={userProfile.avatarUrl}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-white">{userProfile.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-300">
              <span>Rank: <span className="font-semibold text-yellow-400">#{userProfile.rank}</span></span>
              <span>Points: <span className="font-semibold text-blue-400">{userProfile.points}</span></span>
            </div>
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handleUpdateAvatarClick}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Update Avatar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Problems Solved" value={userProfile.problemsSolved} />
          <StatCard label="Contests Attended" value={userProfile.contestsAttended} />
          <StatCard label="Max Rating" value="2100" />
          <StatCard label="Global Rank" value="#123" />
        </div>

        <Heatmap />
      </div>
    </div>
  );
}