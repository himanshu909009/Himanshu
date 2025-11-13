import React from 'react';
import type { Course, User } from '../types';
import { CPP_CHALLENGES } from '../constants';

interface CourseCardProps {
  course: Course;
  onSelect: () => void;
  user: User;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, user }) => {
  // In a real app, this logic would be more robust, likely using course IDs.
  // For this demo, we map the course title to the relevant challenge list.
  const getCourseChallenges = (courseTitle: string) => {
    if (courseTitle === 'Object Oriented Programming in C++') {
      return CPP_CHALLENGES;
    }
    // Return an empty array for other courses since we don't have their challenge data.
    return [];
  };

  const courseChallenges = getCourseChallenges(course.title);
  const courseChallengeIds = new Set(courseChallenges.map(c => c.id));
  
  const solvedChallengeIds = new Set(
    user.submissions
      .filter(s => s.status === 'Accepted' && courseChallengeIds.has(s.challengeId))
      .map(s => s.challengeId)
  );

  const solvedCount = solvedChallengeIds.size;
  const totalCount = course.lessons;
  const progressPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  return (
    <div onClick={onSelect} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition cursor-pointer flex flex-col justify-between">
      <div>
        <div className={`w-12 h-12 rounded-lg ${course.color} mb-4 flex items-center justify-center`}>
          {/* Placeholder for icon */}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
        <p className="text-base text-gray-400 mb-4">{course.category}</p>
        <p className="text-sm text-gray-400">{totalCount} Experiments</p>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm text-gray-300 font-medium mb-1">
          <span>{solvedCount} / {totalCount} Solved</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={solvedCount} aria-valuemin={0} aria-valuemax={totalCount}>
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
            aria-label={`${solvedCount} out of ${totalCount} experiments solved`}
          ></div>
        </div>
      </div>
    </div>
  );
};