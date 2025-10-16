import React, { useState, useMemo } from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES } from '../constants';
import type { Course } from '../types';

const FilterControls = ({ searchTerm, setSearchTerm }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-grow w-full sm:w-auto">
            <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
             <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
             <select className="w-full sm:w-auto p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
                <option>All</option>
            </select>
            <select className="w-full sm:w-auto p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
                <option>Sort by course name</option>
            </select>
            <select className="w-full sm:w-auto p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200">
                <option>Card</option>
            </select>
        </div>
    </div>
);

export function DashboardView() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredCourses = useMemo(() => {
        return COURSES.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Hi, Himanshu! 👋</h1>
                        <p className="text-md text-gray-400">Course overview</p>
                    </div>
                    <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition">
                        Create course
                    </button>
                </div>
                
                <FilterControls searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}