// Fix: Implemented the RecentActivity component.
import React from 'react';
import { RECENT_ACTIVITIES } from '../constants';
import type { RecentActivityItem } from '../types';

const statusStyles: Record<RecentActivityItem['status'], string> = {
  'Accepted': 'text-green-400',
  'Wrong Answer': 'text-red-400',
  'Time Limit Exceeded': 'text-yellow-400',
};

const ActivityItem: React.FC<{ item: RecentActivityItem }> = ({ item }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
    <div>
      <p className="text-white font-medium">{item.title}</p>
      <p className={`text-sm ${statusStyles[item.status]}`}>{item.status}</p>
    </div>
    <span className="text-sm text-gray-400">{item.timestamp}</span>
  </div>
);

export const RecentActivity: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex flex-col">
        {RECENT_ACTIVITIES.map(activity => (
          <ActivityItem key={activity.id} item={activity} />
        ))}
      </div>
    </div>
  );
};
