// Fix: Implemented the ProfileView component.
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RecentActivity } from '../components/RecentActivity';
import type { User } from '../types';

interface ProfileViewProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onNavigate: (view: string, context: number) => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) => (
    <div className="flex items-center text-base text-gray-300">
        <div className="flex-shrink-0 w-5 h-5">{icon}</div>
        <span className="ml-4 truncate">{text || 'Not specified'}</span>
    </div>
);

const DetailInputItem: React.FC<{ icon: React.ReactNode; value?: string; name: string; type?: string; placeholder: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ icon, value, name, type = 'text', placeholder, onChange }) => (
     <div className="flex items-center bg-gray-700 rounded-md p-2">
        <div className="flex-shrink-0 w-5 h-5">{icon}</div>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent text-white ml-4 focus:outline-none"
        />
    </div>
);


export function ProfileView({ user, onUserUpdate, onNavigate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form when user data changes from props
    setEditedUser(user);
  }, [user]);

  const displayStats = useMemo(() => {
    const solvedProblemsCount = new Set(
      user.submissions.filter(s => s.status === 'Accepted').map(s => s.challengeId)
    ).size;

    return user.stats.map(stat => {
      if (stat.label === 'Problems') {
        return { ...stat, value: solvedProblemsCount };
      }
      return stat;
    });
  }, [user.stats, user.submissions]);

  const handleEditToggle = () => {
    if (isEditing) {
        setEditedUser(user); // Revert changes on cancel
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
  
  const handleActivitySelect = (challengeId: number) => {
    onNavigate('challengeEditor', challengeId);
  };

  const MailIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
  const CollegeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
  const CourseIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>;
  
  const commonInputClasses = "w-full bg-gray-700 text-white rounded-md p-2 text-center";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/4">
            <div className="bg-gray-800 p-6 rounded-lg text-center relative">
                {isEditing ? (
                    <>
                        <div className="relative inline-block mx-auto">
                            <img
                                className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-700"
                                src={editedUser.avatarUrl}
                                alt={editedUser.name}
                            />
                            <button onClick={triggerFileSelect} className="absolute -bottom-0 -right-0 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                        </div>
                        <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className={`${commonInputClasses} text-2xl font-bold mb-1`} placeholder="Your Name" />
                        <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} className={`${commonInputClasses} text-sm text-gray-400 mb-6`} placeholder="Your Username" />
                    </>
                ) : (
                    <>
                        <button onClick={handleEditToggle} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <img
                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-700"
                            src={user.avatarUrl}
                            alt={user.name}
                        />
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        <p className="text-gray-400 mb-6">{user.username}</p>
                    </>
                )}
                
                <div className="flex justify-around text-center my-6">
                    {displayStats.map(stat => (
                        <div key={stat.label}>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <hr className="border-t border-gray-700 my-6" />

                <div className="text-left space-y-4">
                    {isEditing ? (
                        <>
                           <DetailInputItem icon={MailIcon} value={editedUser.email} name="email" type="email" placeholder="Email" onChange={handleInputChange} />
                           <DetailInputItem icon={CollegeIcon} value={editedUser.college} name="college" placeholder="College/University" onChange={handleInputChange} />
                           <DetailInputItem icon={CourseIcon} value={editedUser.course} name="course" placeholder="Course/Major" onChange={handleInputChange} />
                        </>
                    ) : (
                        <>
                            <DetailItem text={user.email} icon={MailIcon} />
                            <DetailItem text={user.college} icon={CollegeIcon} />
                            <DetailItem text={user.course} icon={CourseIcon} />
                        </>
                    )}
                </div>

                {isEditing && (
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleEditToggle} className="w-full bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-700 transition">Cancel</button>
                      <button onClick={handleSave} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">Save</button>
                    </div>
                )}
            </div>
          </div>

          <div className="lg:w-3/4 flex flex-col gap-8">
            <RecentActivity activities={user.submissions} onActivitySelect={handleActivitySelect} />
          </div>
        </div>
      </div>
    </div>
  );
}