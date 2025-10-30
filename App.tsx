// Fix: Implemented the main App component with view routing logic.
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CoursesView } from './views/DashboardView';
import { CompilerView } from './views/CompilerView';
import { ChallengeListView } from './views/ChallengeListView';
import { ChallengeEditorView } from './views/ChallengeEditorView';
import { CPP_CHALLENGES, PRACTICE_PROBLEMS, SUBJECT_PROBLEMS } from './constants';
import { ProblemsView } from './views/ProblemsView';

type View = 'courses' | 'compiler' | 'practice' | 'challengeList' | 'challengeEditor';

function App() {
  const [currentView, setCurrentView] = useState<View>('compiler');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  const handleNavigate = (view: View, context?: string | number) => {
    setCurrentView(view);
    if (view === 'challengeList' && typeof context === 'string') {
      setSelectedCourse(context);
    } else if (view === 'challengeEditor' && typeof context === 'number') {
      setSelectedChallengeId(context);
    } else {
      setSelectedCourse(null);
      setSelectedChallengeId(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'courses':
        return <CoursesView onCourseSelect={(courseTitle) => handleNavigate('challengeList', courseTitle)} />;
      case 'practice':
        return <ProblemsView onCourseSelect={(courseTitle) => handleNavigate('challengeList', courseTitle)} />;
      case 'compiler':
        return <CompilerView />;
      case 'challengeList':
        const allPracticeProblems = [...PRACTICE_PROBLEMS, ...SUBJECT_PROBLEMS];
        const cameFromPractice = allPracticeProblems.some(p => p.name === selectedCourse);
        const backView: View = cameFromPractice ? 'practice' : 'courses';

        // For this demo, we'll map a few different selections to the same C++ challenge list.
        const supportedSelections = [
          'Object Oriented Programming in C++',
          'C++',
          'Python',
          'Algorithms',
        ];

        if (selectedCourse && supportedSelections.includes(selectedCourse)) {
          return <ChallengeListView 
            courseTitle={selectedCourse} 
            challenges={CPP_CHALLENGES} 
            onBack={() => handleNavigate(backView)}
            onChallengeSelect={(challengeId) => handleNavigate('challengeEditor', challengeId)}
          />;
        }
        return (
          <div className="p-8 text-center">
            <h1 className="text-xl font-bold">Challenges Not Available</h1>
            <p className="text-gray-400 mt-2">Sorry, the challenges for "{selectedCourse}" are not ready yet.</p>
            <button onClick={() => handleNavigate(backView)} className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Back to {backView === 'practice' ? 'Practice' : 'Courses'}
            </button>
          </div>
        );
      case 'challengeEditor':
        const challenge = CPP_CHALLENGES.find(c => c.id === selectedChallengeId);
        if (challenge) {
            return <ChallengeEditorView challenge={challenge} onBack={() => handleNavigate('challengeList', selectedCourse)} />;
        }
        // Fallback if challenge not found
        return (
             <div className="p-8 text-center">
                <h1 className="text-xl font-bold">Challenge Not Found</h1>
                <button onClick={() => handleNavigate('challengeList', selectedCourse)} className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Back to List
                </button>
            </div>
        );
      default:
        return <CompilerView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <Header currentView={currentView} onNavigate={handleNavigate as (view: string) => void} />
      <main className="flex-grow min-h-0">
        {renderView()}
      </main>
    </div>
  );
}

export default App;