import React from 'react';
import type { PracticeProblem } from '../types';

interface PracticeCardProps {
  problem: PracticeProblem;
  onClick: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ problem, onClick }) => {
  return (
    <div onClick={onClick} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col justify-between hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-2">{problem.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{problem.description}</p>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
            <span>{problem.problems} Problems</span>
            <span className="flex items-center">
                {problem.level}
            </span>
        </div>
    </div>
  );
};