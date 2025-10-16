// Fix: Implemented the ProfileView component.
import React, { useState, useRef, useEffect } from 'react';
import { Heatmap } from '../components/Heatmap';
import { RecentActivity } from '../components/RecentActivity';
import type { User } from '../types';

interface ProfileViewProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) => (
    <div className="flex items-center text-sm text-gray-400 mb-2">
        {icon}
        <span className="ml-3 truncate">{text || 'Not specified'}</span>
    </div>
);

export function ProfileView({ user, onUserUpdate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditedUser(user);
    }
  }, [user, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser(user);
    } else {
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUserUpdate(editedUser);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newAvatarUrl = URL.createObjectURL(e.target.files[0]);
      setEditedUser({ ...editedUser, avatarUrl: newAvatarUrl });
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const commonInputClasses = "w-full bg-gray-700 text-white text-center rounded-md py-1";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: User Info */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 p-6 rounded-lg text-center relative">
               <button onClick={handleEditToggle} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                )}
                 <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className={`${commonInputClasses} text-2xl font-bold`}/>
                  <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} className={`${commonInputClasses} text-gray-400`}/>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400">{user.username}</p>
                </>
              )}

              <div className="flex justify-around text-center my-6">
                {user.stats.map(stat => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {isEditing ? (
                  <div className="space-y-4 text-left border-t border-gray-700 pt-6">
                     <div>
                        <label className="text-xs text-gray-400 block mb-1">Email</label>
                        <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className={`${commonInputClasses} text-left px-2`} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">College</label>
                        <input type="text" name="college" value={editedUser.college} onChange={handleInputChange} className={`${commonInputClasses} text-left px-2`} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Course</label>
                        <input type="text" name="course" value={editedUser.course} onChange={handleInputChange} className={`${commonInputClasses} text-left px-2`} />
                      </div>
                  </div>
              ) : (
                 <div className="text-left pt-6 border-t border-gray-700">
                    <DetailItem text={user.email} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>} />
                    <DetailItem text={user.college} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} />
                    <DetailItem text={user.course} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>} />
                </div>
              )}
              
              {isEditing && (
                <div className="flex gap-4 mt-6">
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