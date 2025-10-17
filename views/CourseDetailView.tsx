import React, { useState } from 'react';
import { COURSE_DETAILS } from '../constants';
import { AccordionItem } from '../components/AccordionItem';
import type { CourseDetails } from '../types';

interface CourseDetailViewProps {
    courseName: string;
    onBack: () => void;
}

const StatItem: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
    <div className="flex items-center text-sm text-gray-300">
        {icon}
        <span className="ml-2">{label}</span>
    </div>
);

const Tag: React.FC<{ icon: React.ReactNode, label: string, className?: string}> = ({ icon, label, className }) => (
    <div className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-md ${className}`}>
        {icon}
        <span className="ml-2">{label}</span>
    </div>
);

const gridPattern = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(30 58 138 / 0.25)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;

export function CourseDetailView({ courseName, onBack }: CourseDetailViewProps) {
    const courseData = COURSE_DETAILS[courseName];
    const [openModuleId, setOpenModuleId] = useState<number | null>(null);

    if (!courseData) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Course Not Found</h1>
                <p className="text-gray-400 mt-2">Could not find details for "{courseName}".</p>
                <button onClick={onBack} className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Go Back
                </button>
            </div>
        );
    }

    const { title, description, icon, tags, stats, modules } = courseData;

    const handleToggleModule = (moduleId: number) => {
        setOpenModuleId(openModuleId === moduleId ? null : moduleId);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Problems
                </button>

                <div className="bg-blue-900/50 rounded-lg p-8 mb-8 relative overflow-hidden" style={{backgroundImage: gridPattern}}>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0" dangerouslySetInnerHTML={{ __html: icon }} />
                        <div className="flex-grow">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                {tags.certification && <Tag icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>} label="Certification Available" className="bg-white/10 text-white" />}
                                <Tag icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>} label={tags.rating} className="bg-yellow-400/10 text-yellow-300" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                            <p className="text-gray-300 max-w-3xl mb-6">{description}</p>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>} label={`${stats.lessons} Lessons`} />
                                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>} label={`${stats.hours} Hours`} />
                                <StatItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>} label={`${stats.problems} Problems`} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:w-1/2">
                            <div className="flex justify-between text-xs text-gray-300 mb-1">
                                <span>Your Progress</span>
                                <span className="font-semibold">0% Completed</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                            </div>
                        </div>
                        <button className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition">
                            Start Learning
                        </button>
                    </div>
                </div>

                <div>
                    {modules.map(module => (
                        <AccordionItem 
                            key={module.id} 
                            module={module}
                            isOpen={openModuleId === module.id}
                            onToggle={() => handleToggleModule(module.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}