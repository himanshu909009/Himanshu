import React from 'react';
import { ChallengeListItem } from '../components/ChallengeListItem';
import type { Challenge, User } from '../types';

interface ChallengeListViewProps {
    courseTitle: string;
    challenges: Challenge[];
    onBack: () => void;
    onChallengeSelect: (challengeId: number) => void;
    user: User;
}

export function ChallengeListView({ courseTitle, challenges, onBack, onChallengeSelect, user }: ChallengeListViewProps) {
    const solvedChallengeIds = new Set(
        user.submissions
            .filter(s => s.status === 'Accepted')
            .map(s => s.challengeId)
    );
    
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center text-base text-gray-400 hover:text-white transition group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Courses
                </button>
                <h1 className="text-4xl font-bold text-white mb-6">List of Experiments</h1>
                <div className="space-y-4">
                    {challenges.map(challenge => (
                        <ChallengeListItem 
                            key={challenge.id} 
                            challenge={challenge} 
                            onPerform={onChallengeSelect} 
                            isSolved={solvedChallengeIds.has(challenge.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}