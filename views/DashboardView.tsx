import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES } from '../constants';

export function DashboardView() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Continue Learning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map(course => (
                        <CourseCard key={course.title} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
