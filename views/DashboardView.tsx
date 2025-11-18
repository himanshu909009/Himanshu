import React from 'react';
import { CourseCard } from '../components/CourseCard';
import { COURSES } from '../constants';
import type { User } from '../types';
import { RecentActivity } from '../components/RecentActivity';

interface CoursesViewProps {
    onCourseSelect: (courseTitle: string) => void;
    user: User;
    onActivitySelect: (challengeId: number) => void;
}

export function CoursesView({ onCourseSelect, user, onActivitySelect }: CoursesViewProps) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main content: Courses */}
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl font-bold text-white mb-6">Courses</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {COURSES.map(course => (
                                <CourseCard 
                                    key={course.title} 
                                    course={course} 
                                    onSelect={() => onCourseSelect(course.title)} 
                                    user={user}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Sidebar: Recent Activity */}
                    <div className="lg:w-1/3">
                        <RecentActivity activities={user.submissions} onActivitySelect={onActivitySelect} />
                    </div>
                </div>
            </div>
        </div>
    );
}