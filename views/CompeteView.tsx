// Fix: Implemented the CompeteView component.
import React from 'react';
import { ContestCard } from '../components/ContestCard';
import { PastContestItem } from '../components/PastContestItem';
import { LeaderboardItem } from '../components/LeaderboardItem';
import { CONTESTS, PAST_CONTESTS, LEADERBOARD_USERS } from '../constants';

export function CompeteView() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Compete</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-300 mb-4">Active Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {CONTESTS.map(contest => (
                                <ContestCard key={contest.title} contest={contest} />
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-300 mb-4">Past Contests</h2>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="space-y-3">
                                {PAST_CONTESTS.map(contest => (
                                    <PastContestItem key={contest.name} contest={contest} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Leaderboard */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-300 mb-4">Leaderboard</h2>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <div className="space-y-2">
                                {LEADERBOARD_USERS.map(user => (
                                    <LeaderboardItem key={user.rank} user={user} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
