import React from 'react';
import type { SimulationOutput } from '../types';

interface OutputDisplayProps {
  output: SimulationOutput | null;
  isLoading: boolean;
  error: string | null;
}

const OutputContent: React.FC<{ output: SimulationOutput }> = ({ output }) => {
    const { compilation, execution, output: programOutput } = output;

    if (compilation.status === 'error') {
        return <pre className="text-red-400 whitespace-pre-wrap break-words">{compilation.message}</pre>;
    }

    if (programOutput.stderr) {
        return <pre className="text-yellow-400 whitespace-pre-wrap break-words">{programOutput.stderr}</pre>;
    }
    
    if (programOutput.stdout) {
         return <pre className="text-white whitespace-pre-wrap break-words">{programOutput.stdout}</pre>;
    }
    
    return <p className="text-gray-500 italic">Execution successful, but no output (stdout) was produced.</p>;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error }) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (error) {
            return <pre className="text-red-400 whitespace-pre-wrap break-words">{error}</pre>;
        }
        
        if (!output) {
            return <div className="h-full"></div>; // Empty state
        }
        
        return <OutputContent output={output} />;
    };

    return (
        <div className="flex flex-col h-full flex-grow">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
                Output
            </h3>
            <div className="flex-grow w-full bg-gray-950 border border-gray-700 text-gray-200 rounded-md p-4 font-mono text-sm resize-y overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
};