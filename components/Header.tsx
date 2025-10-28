import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
}

const NavLink: React.FC<{
  view: string;
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}> = ({ view, currentView, onNavigate, children }) => (
  <button
    onClick={() => onNavigate(view)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
      currentView === view
        ? 'bg-gray-900 text-white'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ user, currentView, onNavigate }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <span className="text-white font-bold text-xl">CodeRunner</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavLink view="courses" currentView={currentView} onNavigate={onNavigate}>Courses</NavLink>
                <NavLink view="compiler" currentView={currentView} onNavigate={onNavigate}>Compiler</NavLink>
              </div>
            </div>
          </div>
           <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-white text-sm font-medium mr-3">{user.name}</span>
                <img className="h-8 w-8 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
              </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
