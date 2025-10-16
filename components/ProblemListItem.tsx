// Fix: Implemented the ProblemListItem component.
import React from 'react';
import type { ContestProblem } from '../types';

interface ProblemListItemProps {
  problem: ContestProblem;
}

const difficultyColorMap = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
};

export const ProblemListItem: React.FC<ProblemListItemProps> = ({ problem }) => {
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{problem.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.title}</td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${difficultyColorMap[problem.difficulty]}`}>{problem.difficulty}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.points}</td>
    </tr>
  );
};
