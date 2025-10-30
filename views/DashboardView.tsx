import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES } from '../constants';

interface CoursesViewProps {
    onCourseSelect: (courseTitle: string) => void;
}

export function CoursesView({ onCourseSelect }: CoursesViewProps) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map(course => (
                        <CourseCard key={course.title} course={course} onSelect={() => onCourseSelect(course.title)} />
                    ))}
                </div>
            </div>
        </div>
    );
}