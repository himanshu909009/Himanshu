import React from 'react';
import type { Challenge } from '../types';

const StarIcon: React.FC = () => (
  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface ChallengeListItemProps {
  challenge: Challenge;
  onPerform: (challengeId: number) => void;
  isSolved: boolean;
}

export const ChallengeListItem: React.FC<ChallengeListItemProps> = ({ challenge, onPerform, isSolved }) => {
  const { id, title, difficulty, category, maxScore, successRate, description } = challenge;
  return (
    <div className="bg-gray-800 p-6 rounded-lg flex justify-between items-center hover:bg-gray-700 transition">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center text-base text-gray-400 mb-3 flex-wrap">
          <span className="text-green-400 font-medium">{difficulty}</span>
          <span className="mx-2 text-gray-600">,</span>
          <span>{category}</span>
          <span className="mx-2 text-gray-600">,</span>
          <span>Max Score: {maxScore}</span>
          <span className="mx-2 text-gray-600">,</span>
          <span>Success Rate: {successRate}</span>
        </div>
        <p className="text-base text-gray-400">{description}</p>
      </div>
      <div className="flex items-center space-x-6 flex-shrink-0 ml-6">
        <button aria-label="Add to favorites" className="hover:text-yellow-400 transition">
            <StarIcon />
        </button>
        <button 
          onClick={() => onPerform(id)}
          className={`px-6 py-2 rounded-md font-semibold text-base transition ${
            isSolved
              ? 'bg-gray-700 text-green-400'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSolved ? 'Performed' : 'Perform'}
        </button>
      </div>
    </div>
  );
};