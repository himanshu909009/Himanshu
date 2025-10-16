import React from 'react';
import { PracticeCard } from '../components/PracticeCard';
import { PRACTICE_PROBLEMS } from '../constants';

export function ProblemsView() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Programming Languages</h1>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {PRACTICE_PROBLEMS.map(problem => (
                        <PracticeCard key={problem.name} problem={problem} />
                    ))}
                </div>
            </div>
        </div>
    );
}
