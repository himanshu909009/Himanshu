// Fix: Created the missing ProblemTable component.
import React from 'react';
import type { ContestProblem } from '../types';

interface ProblemTableProps {
  problems: ContestProblem[];
}

const difficultyColorMap: Record<ContestProblem['difficulty'], string> = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
};

export const ProblemTable: React.FC<ProblemTableProps> = ({ problems }) => {
  return (
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
                {problems.map(problem => (
                     <tr key={problem.id} className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{problem.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.title}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${difficultyColorMap[problem.difficulty]}`}>{problem.difficulty}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};
