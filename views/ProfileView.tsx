// Fix: Implemented the ProfileView component.
import React, { useState, useRef } from 'react';
import { Heatmap } from '../components/Heatmap';
import { RecentActivity } from '../components/RecentActivity';

const initialUser = {
  name: 'Alex Doe',
  username: '@alexdoe',
  avatarUrl: `https://i.pravatar.cc/150?u=alexdoe`,
  stats: [
      { label: 'Problems Solved', value: 128 },
      { label: 'Contests Attended', value: 22 },
      { label: 'Highest Rank', value: 42 },
  ],
};

export function ProfileView() {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel logic
      setEditedUser(user);
    } else {
      // Start editing
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, name: e.target.value });
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, username: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newAvatarUrl = URL.createObjectURL(e.target.files[0]);
      setEditedUser({ ...editedUser, avatarUrl: newAvatarUrl });
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: User Info */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 p-6 rounded-lg text-center relative">
               <button onClick={handleEditToggle} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
               </button>

              <div className="relative inline-block">
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  src={isEditing ? editedUser.avatarUrl : user.avatarUrl}
                  alt={user.name}
                />
                {isEditing && (
                    <button onClick={triggerFileSelect} className="absolute bottom-4 right-0 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700 transition">
                         <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                )}
                 <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              </div>
              
              {isEditing ? (
                <>
                  <input type="text" value={editedUser.name} onChange={handleNameChange} className="w-full bg-gray-700 text-white text-center text-2xl font-bold rounded-md py-1 mb-2"/>
                  <input type="text" value={editedUser.username} onChange={handleUsernameChange} className="w-full bg-gray-700 text-gray-400 text-center rounded-md py-1 mb-6"/>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400 mb-6">{user.username}</p>
                </>
              )}
              
              <div className="flex justify-around text-center mb-6">
                {user.stats.map(stat => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <button onClick={handleEditToggle} className="w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition">Cancel</button>
                  <button onClick={handleSave} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">Save</button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Activity */}
          <div className="lg:w-3/4 flex flex-col gap-8">
            <Heatmap />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}