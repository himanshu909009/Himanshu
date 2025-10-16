// Fix: Implemented the PastContestItem component.
import React from 'react';
import type { PastContest } from '../types';

interface PastContestItemProps {
  contest: PastContest;
}

export const PastContestItem: React.FC<PastContestItemProps> = ({ contest }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-md hover:bg-gray-700 transition cursor-pointer">
      <span className="text-white font-medium">{contest.name}</span>
      <span className="text-sm text-gray-400">{contest.date}</span>
    </div>
  );
};
