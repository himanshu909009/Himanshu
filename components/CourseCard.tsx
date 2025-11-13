import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div onClick={onSelect} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition cursor-pointer">
      <div className={`w-12 h-12 rounded-lg ${course.color} mb-4 flex items-center justify-center`}>
        {/* Placeholder for icon */}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
      <p className="text-base text-gray-400 mb-4">{course.category}</p>
      <div className="flex text-sm text-gray-400">
        <span>{course.lessons} Experiments</span>
      </div>
    </div>
  );
};