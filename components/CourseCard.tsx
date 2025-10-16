import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition">
      <div className={`w-12 h-12 rounded-lg ${course.color} mb-4 flex items-center justify-center`}>
        {/* Placeholder for icon */}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{course.category}</p>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{course.lessons} Lessons</span>
        <span>{course.hours} hours</span>
        <span>{course.level}</span>
      </div>
    </div>
  );
};
