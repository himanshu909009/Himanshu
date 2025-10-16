// Fix: Implemented the main App component with view routing logic.
import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { CompilerView } from './views/CompilerView';
import { ProblemsView } from './views/ProblemsView';
import { CompeteView } from './views/CompeteView';

type View = 'dashboard' | 'compiler' | 'problems' | 'compete';

function App() {
  const [currentView, setCurrentView] = useState<View>('compiler');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'compiler':
        return <CompilerView />;
      case 'problems':
        return <ProblemsView />;
      case 'compete':
        return <CompeteView />;
      default:
        return <CompilerView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header currentView={currentView} onNavigate={setCurrentView as (view: string) => void} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
