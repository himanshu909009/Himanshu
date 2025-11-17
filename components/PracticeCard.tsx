import React from 'react';
import type { PracticeProblem } from '../types';

interface PracticeCardProps {
  problem: PracticeProblem;
  onClick: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ problem, onClick }) => {
  return (
    <div 
        onClick={onClick} 
        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
        <div className="relative">
            <div className={`h-20 ${problem.color}`}></div>
            <div className="absolute top-12 left-6 bg-gray-100 p-3 rounded-lg border-4 border-white shadow-sm">
                <div dangerouslySetInnerHTML={{ __html: problem.icon }} />
            </div>
        </div>
        
        <div className="p-6 pt-10 flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{problem.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{problem.description}</p>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500 font-medium">
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {problem.problems} Problems
            </span>
            <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {problem.level}
            </span>
        </div>
    </div>
  );
};