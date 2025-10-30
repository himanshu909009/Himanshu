import React from 'react';

interface HeaderProps {
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
    className={`px-4 py-2 rounded-lg font-medium transition ${
      currentView === view
        ? 'bg-gray-900 text-white text-base'
        : 'text-gray-400 hover:text-white text-base'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                <span className="text-white font-bold text-2xl">CodeRunner</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavLink view="courses" currentView={currentView} onNavigate={onNavigate}>Courses</NavLink>
                <NavLink view="practice" currentView={currentView} onNavigate={onNavigate}>Practice</NavLink>
                <NavLink view="compiler" currentView={currentView} onNavigate={onNavigate}>Compiler</NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};