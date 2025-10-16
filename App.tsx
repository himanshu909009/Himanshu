import React, { useState } from 'react';
import { Header } from './components/Header';
import { CompilerView } from './views/CompilerView';
import { DashboardView } from './views/DashboardView';

type View = 'compiler' | 'dashboard';

function App() {
    const [view, setView] = useState<View>('compiler');
    
    const themeClass = 'bg-gray-900 text-gray-300';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
            <Header currentView={view} setView={setView} />
            <main>
                {view === 'compiler' && <CompilerView />}
                {view === 'dashboard' && <DashboardView />}
            </main>
        </div>
    );
}

export default App;