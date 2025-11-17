// Fix: Implemented the main App component with view routing logic.
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CoursesView } from './views/DashboardView';
import { CompilerView } from './views/CompilerView';
import { ChallengeListView } from './views/ChallengeListView';
import { ChallengeEditorView } from './views/ChallengeEditorView';
// Fix: Corrected import names. 'PRACTICE_PROBLEMS' is exported as 'PRACTICE_LANGUAGES'. 'SUBJECT_PROBLEMS' is not exported.
import { CPP_CHALLENGES, PRACTICE_LANGUAGES, INITIAL_USER, COURSE_DETAILS } from './constants';
import { ProblemsView } from './views/ProblemsView';
import { ProfileView } from './views/ProfileView';
import { CourseDetailView } from './views/CourseDetailView';
import type { User } from './types';

type View = 'courses' | 'compiler' | 'practice' | 'challengeList' | 'challengeEditor' | 'profile' | 'courseDetail';

const USER_STORAGE_KEY = 'userProfile';

function App() {
  const [currentView, setCurrentView] = useState<View>('courses');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [editorOrigin, setEditorOrigin] = useState<View | null>(null);
  
  const [user, setUser] = useState<User>(() => {
    try {
      const savedUserJSON = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserJSON) {
        // Simple migration: if old user object doesn't have submissions, add it.
        const parsedUser = JSON.parse(savedUserJSON);
        if (!parsedUser.submissions) {
          parsedUser.submissions = INITIAL_USER.submissions;
        }
        return parsedUser;
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    // If nothing in storage or parsing fails, return initial user and save it.
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  });

  const handleUserUpdate = (updatedUser: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      // Still update state even if localStorage fails
      setUser(updatedUser);
    }
  };

  const handleNavigate = (view: View, context?: string | number) => {
    if (view === 'challengeEditor') {
        setEditorOrigin(currentView);
    }
    setCurrentView(view);
    if ((view === 'challengeList' || view === 'courseDetail') && typeof context === 'string') {
      setSelectedCourse(context);
    } else if (view === 'challengeEditor' && typeof context === 'number') {
      // When navigating to the editor, find the associated course title to preserve breadcrumbs
      const challenge = CPP_CHALLENGES.find(c => c.id === context);
      if(challenge) {
          const course = challenge.category.includes('C++') ? 'C++' : 'Algorithms';
          setSelectedCourse(course);
      }
      setSelectedChallengeId(context);
    } else if (view !== 'challengeEditor' && view !== 'challengeList' && view !== 'courseDetail') { // Prevent clearing context when navigating away from editor
      setSelectedCourse(null);
      setSelectedChallengeId(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'courses':
        return <CoursesView user={user} onCourseSelect={(courseTitle) => handleNavigate('challengeList', courseTitle)} />;
      case 'practice':
        return <ProblemsView onCourseSelect={(courseTitle) => {
            const courseKeyMap: Record<string, string> = {
                'Practice C++': 'C++',
                'Practice Python': 'Python',
            };
            const courseKey = courseKeyMap[courseTitle];
            
            if (courseKey && COURSE_DETAILS[courseKey]) {
                handleNavigate('courseDetail', courseKey);
            } else {
                handleNavigate('challengeList', courseTitle);
            }
        }} />;
      case 'compiler':
        return <CompilerView />;
      case 'profile':
        return <ProfileView user={user} onUserUpdate={handleUserUpdate} onNavigate={(view, id) => handleNavigate(view as View, id)} />;
      case 'challengeList':
        // Fix: Use PRACTICE_LANGUAGES and remove undefined SUBJECT_PROBLEMS.
        const allPracticeProblems = [...PRACTICE_LANGUAGES];
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
            user={user}
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
        const handleBack = () => {
            const backView = editorOrigin || 'challengeList';
            handleNavigate(backView as View, selectedCourse);
        };
        if (challenge) {
            return <ChallengeEditorView 
                        challenge={challenge} 
                        user={user}
                        onUserUpdate={handleUserUpdate}
                        onBack={handleBack} 
                    />;
        }
        // Fallback if challenge not found
        return (
             <div className="p-8 text-center">
                <h1 className="text-xl font-bold">Challenge Not Found</h1>
                <button onClick={handleBack} className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Back to List
                </button>
            </div>
        );
      case 'courseDetail':
        if (selectedCourse && COURSE_DETAILS[selectedCourse]) {
            return <CourseDetailView
                courseName={selectedCourse}
                user={user}
                onBack={() => handleNavigate('practice')}
                onProblemSelect={(challengeId) => handleNavigate('challengeEditor', challengeId)}
            />;
        }
        // Fallback if course not found
        return (
             <div className="p-8 text-center">
                <h1 className="text-xl font-bold">Course Details Not Found</h1>
                <button onClick={() => handleNavigate('practice')} className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Back to Practice
                </button>
            </div>
        );
      default:
        return <CompilerView />;
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate as (view: string) => void}
        user={user}
      />
      <main className="flex-grow min-h-0">
        {renderView()}
      </main>
    </div>
  );
}

export default App;