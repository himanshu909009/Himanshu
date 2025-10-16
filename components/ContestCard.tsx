// Fix: Implemented the ContestCard component.
import React from 'react';
import type { Contest } from '../types';

interface ContestCardProps {
  contest: Contest;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-700 transition cursor-pointer">
      <h3 className="text-lg font-bold text-white mb-2">{contest.title}</h3>
      <p className="text-sm text-green-400 mb-4">{contest.startTime}</p>
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{contest.duration}</span>
        <span>{contest.participants} Participants</span>
      </div>
      <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
        View Contest
      </button>
    </div>
  );
};
