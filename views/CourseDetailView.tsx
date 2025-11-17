import React, { useState } from 'react';
import { SYLLABUS_MODULES } from '../constants';
import type { User } from '../types';

interface CourseDetailViewProps {
    courseName: string; // Keep for context for 'back' button
    user: User;
    onBack: () => void;
    onProblemSelect: (challengeId: number) => void;
}

export function CourseDetailView({ user, onBack, onProblemSelect }: CourseDetailViewProps) {
    const [openModuleId, setOpenModuleId] = useState<number | null>(1);

    const solvedChallengeIds = new Set(
        user.submissions
            .filter(s => s.status === 'Accepted')
            .map(s => s.challengeId)
    );

    const handleToggleModule = (moduleId: number) => {
        setOpenModuleId(prevId => (prevId === moduleId ? null : moduleId));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
            <div className="max-w-screen-xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Practice
                </button>

                <div className="space-y-4">
                    {SYLLABUS_MODULES.map(module => {
                        const isOpen = openModuleId === module.id;
                        return (
                            <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <button
                                    onClick={() => handleToggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center mr-5">
                                            <span className="text-xl font-bold text-blue-600">{module.id}</span>
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-xl font-bold text-gray-800">{module.title}</h2>
                                            <p className="text-gray-500 text-sm mt-1">{module.description}</p>
                                            <p className="text-gray-400 text-xs mt-2 font-medium">0% Solved</p>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-6 h-6 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isOpen && module.problems.length > 0 && (
                                    <div className="bg-slate-900 border-t border-gray-200">
                                        <table className="w-full text-base text-left text-gray-300">
                                            <thead className="text-xs text-gray-400 uppercase tracking-wider">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 font-medium w-24">Status</th>
                                                    <th scope="col" className="px-6 py-3 font-medium">Problem</th>
                                                    <th scope="col" className="px-6 py-3 font-medium text-right">Difficulty</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {module.problems.map((problem, index) => {
                                                    const isSolved = solvedChallengeIds.has(problem.challengeId);
                                                    return (
                                                        <tr
                                                            key={problem.challengeId}
                                                            onClick={() => onProblemSelect(problem.challengeId)}
                                                            className="hover:bg-slate-800/50 transition cursor-pointer"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className={`w-4 h-4 rounded-full ${isSolved ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <span className="text-gray-400 w-8">{index + 1}.</span>
                                                                    <span className="font-medium text-blue-400 hover:underline">{problem.title}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-white">
                                                                    {problem.difficulty}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}