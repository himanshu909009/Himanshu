// Fix: Implemented the RecentActivity component.
import React from 'react';
import type { RecentActivityItem } from '../types';

interface RecentActivityProps {
    activities: RecentActivityItem[];
    onActivitySelect: (challengeId: number) => void;
}

const statusStyles: Record<RecentActivityItem['status'], string> = {
  'Accepted': 'text-green-400',
  'Wrong Answer': 'text-red-400',
  'Time Limit Exceeded': 'text-yellow-400',
};

function formatTimeAgo(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `just now`;
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
}

const ActivityItem: React.FC<{ item: RecentActivityItem; onSelect: (challengeId: number) => void; }> = ({ item, onSelect }) => (
  <button 
    onClick={() => onSelect(item.challengeId)}
    className="w-full flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0 text-left hover:bg-gray-700/50 transition rounded-md"
    aria-label={`View submission for ${item.title}`}
  >
    <div>
      <p className="text-white font-medium">{item.title}</p>
      <p className={`text-sm ${statusStyles[item.status]}`}>{item.status}</p>
    </div>
    <span className="text-sm text-gray-400 flex-shrink-0 ml-4">{formatTimeAgo(item.timestamp)}</span>
  </button>
);

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onActivitySelect }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex flex-col">
        {activities.map(activity => (
          <ActivityItem key={activity.id} item={activity} onSelect={onActivitySelect} />
        ))}
      </div>
    </div>
  );
};