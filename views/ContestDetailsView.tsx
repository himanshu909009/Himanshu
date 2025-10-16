// Fix: Implemented the ContestDetailsView component.
import React from 'react';
import { ProblemListItem } from '../components/ProblemListItem';
import { CONTEST_PROBLEMS } from '../constants';

export function ContestDetailsView() {
    // This is a placeholder view. In a real app, you'd fetch contest details based on an ID.
    const contest = {
        title: 'Weekly Contest #345',
        startTime: 'July 22, 2024 10:30 AM',
        duration: '90 mins',
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
                    <div className="flex items-center text-gray-400 text-sm">
                        <span>{contest.startTime}</span>
                        <span className="mx-2">|</span>
                        <span>{contest.duration}</span>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden">
                     <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {CONTEST_PROBLEMS.map(problem => (
                                <ProblemListItem key={problem.id} problem={problem} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
