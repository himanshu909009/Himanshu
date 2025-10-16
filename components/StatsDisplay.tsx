import React from 'react';
import type { SimulationOutput } from '../types';

interface StatsDisplayProps {
  output: SimulationOutput | null;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center text-sm bg-gray-800 border border-gray-700 rounded-md px-3 py-2">
        {icon}
        <span className="text-gray-400 mr-2">{label}:</span>
        <span className="font-semibold text-white">{value}</span>
    </div>
);

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ output }) => {
    const showStats = output && output.compilation.status === 'success';
    const timeUsage = output?.output.timeUsage;
    const memoryUsage = output?.output.memoryUsage;
    
    if (!showStats) {
        return null; // Don't render anything if there's no successful output
    }

    return (
        <div className="flex items-center gap-4">
            {typeof timeUsage === 'number' && (
                <StatItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Time"
                    value={`${timeUsage} ms`}
                />
            )}
             {typeof memoryUsage === 'number' && (
                <StatItem 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>}
                    label="Memory"
                    value={`${memoryUsage} KB`}
                />
            )}
        </div>
    );
};
