import React from 'react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);


export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
      <img src={course.image} alt={course.title} className="w-full h-32 object-cover" />
      <div className="p-4">
        <h3 className="text-md font-semibold text-blue-400 hover:underline cursor-pointer">{course.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{course.category}</p>
      </div>
      <div className="px-4 pb-4 flex justify-end">
          <button className="text-gray-400 hover:text-white">
            <MoreIcon />
          </button>
      </div>
    </div>
  );
};