import React from 'react';
import { PracticeCard } from '../components/PracticeCard';
import { PRACTICE_LANGUAGES } from '../constants';
import { RecentActivity } from '../components/RecentActivity';
import type { User } from '../types';

interface ProblemsViewProps {
    onCourseSelect: (courseName: string) => void;
    user: User;
    onActivitySelect: (challengeId: number) => void;
}

export function ProblemsView({ onCourseSelect, user, onActivitySelect }: ProblemsViewProps) {
    return (
        <div className="bg-gray-900 text-white h-full overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-screen-2xl mx-auto">
                     <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main content: Practice Languages */}
                        <div className="flex-grow">
                             <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">Programming Languages</h1>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <a href="#" className="text-blue-400 hover:underline">Recent Contest Problems →</a>
                                        <a href="#" className="text-blue-400 hover:underline">Old practice problems →</a>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {PRACTICE_LANGUAGES.map(problem => (
                                    <PracticeCard key={problem.name} problem={problem} onClick={() => onCourseSelect(problem.name)} />
                                ))}
                            </div>
                        </div>
                        {/* Sidebar: Recent Activity */}
                        <div className="lg:w-1/3 lg:max-w-md flex-shrink-0">
                             <RecentActivity activities={user.submissions} onActivitySelect={onActivitySelect} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}