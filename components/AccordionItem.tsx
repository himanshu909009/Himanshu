// Fix: Created the missing AccordionItem component.
import React from 'react';
import type { CourseModule } from '../types';

interface AccordionItemProps {
    module: CourseModule;
    isOpen: boolean;
    onToggle: () => void;
}

const LessonIcon: React.FC<{ type: string }> = ({ type }) => {
    const iconMap: Record<string, React.ReactNode> = {
        video: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
        ),
        reading: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
            </svg>
        ),
        quiz: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
        ),
        practice: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        )
    };
    return iconMap[type] || null;
};


export const AccordionItem: React.FC<AccordionItemProps> = ({ module, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-700">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-800 transition"
            >
                <div className="flex items-center">
                    <span className="text-gray-500 font-bold mr-4">
                        {module.id.toString().padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-white">{module.title}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-4">{module.lessons.length} lessons</span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="bg-gray-900/50">
                    <ul className="divide-y divide-gray-800">
                        {module.lessons.map(lesson => (
                            <li key={lesson.id} className="flex items-center justify-between p-4 pl-14 hover:bg-gray-800 transition cursor-pointer">
                                <div className="flex items-center text-sm text-gray-300">
                                    <span className="mr-3 text-gray-500">
                                        <LessonIcon type={lesson.type} />
                                    </span>
                                    {lesson.title}
                                </div>
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
