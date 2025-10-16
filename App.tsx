// Fix: Implemented the main App component with view routing logic.
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CoursesView } from './views/DashboardView';
import { CompilerView } from './views/CompilerView';
import { ProblemsView } from './views/ProblemsView';
import { CompeteView } from './views/CompeteView';
import { ProfileView } from './views/ProfileView';
import type { User } from './types';
import { INITIAL_USER } from './constants';

type View = 'courses' | 'compiler' | 'problems' | 'compete' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<View>('compiler');
  const [user, setUser] = useState<User>(INITIAL_USER);

  const renderView = () => {
    switch (currentView) {
      case 'courses':
        return <CoursesView />;
      case 'compiler':
        return <CompilerView />;
      case 'problems':
        return <ProblemsView />;
      case 'compete':
        return <CompeteView />;
      case 'profile':
        return <ProfileView user={user} onUserUpdate={setUser} />;
      default:
        return <CompilerView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header user={user} currentView={currentView} onNavigate={setCurrentView as (view: string) => void} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;