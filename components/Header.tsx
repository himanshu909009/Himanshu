import React from 'react';

type View = 'compiler' | 'dashboard';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavLink: React.FC<{
    view: View;
    currentView: View;
    setView: (view: View) => void;
    children: React.ReactNode;
}> = ({ view, currentView, setView, children }) => {
    const isActive = currentView === view;
    // Updated styles to match screenshot
    const activeClasses = 'text-blue-400 border-b-2 border-blue-400';
    const inactiveClasses = 'text-gray-300 hover:text-white';
    
    return (
        <button
            onClick={() => setView(view)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
};

const StaticLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button
        // Updated styles for consistency
        className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
        disabled
    >
        {children}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    return (
        <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <svg className="h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                        </svg>
                        <span className="ml-2 text-xl font-bold text-white">CodeRunner</span>
                    </div>
                    <nav className="flex items-center space-x-4">
                        {/* Added Home button */}
                        <NavLink view="dashboard" currentView={currentView} setView={setView}>Home</NavLink>
                        <StaticLink>Problems</StaticLink>
                        <NavLink view="compiler" currentView={currentView} setView={setView}>Compiler</NavLink>
                        <StaticLink>Compete</StaticLink>
                    </nav>
                </div>
            </div>
        </header>
    );
};