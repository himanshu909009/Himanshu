import React from 'react';
import type { PracticeProblem } from '../types';

interface PracticeCardProps {
  problem: PracticeProblem;
  onClick: () => void;
}

const Icon: React.FC<{ svg: string }> = ({ svg }) => (
    <div className="p-2 bg-gray-700 rounded-md" dangerouslySetInnerHTML={{ __html: svg }} />
);

const LevelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const PracticeCard: React.FC<PracticeCardProps> = ({ problem, onClick }) => {
  return (
    <div onClick={onClick} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col justify-between hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div>
            <div className={`p-4 ${problem.color} flex items-center`}>
                <Icon svg={problem.icon} />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{problem.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{problem.description}</p>
            </div>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
            <span>{problem.problems} Problems</span>
            <span className="flex items-center">
                <LevelIcon />
                {problem.level}
            </span>
        </div>
    </div>
  );
};