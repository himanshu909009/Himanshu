// Fix: Implement the LeaderboardItem component.
import React from 'react';
import type { LeaderboardUser } from '../types';

interface LeaderboardItemProps {
  user: LeaderboardUser;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
      <div className="flex items-center">
        <span className="text-lg font-bold text-gray-400 w-8">{user.rank}</span>
        {/* Using a placeholder for avatar */}
        <div className="w-10 h-10 bg-gray-600 rounded-full mr-4"></div>
        <span className="text-white font-medium">{user.name}</span>
      </div>
      <span className="text-lg font-bold text-yellow-400">{user.score}</span>
    </div>
  );
};
