import React, { useState } from 'react';
import { ProblemDescription } from '../components/ProblemDescription';
import { CodeEditor } from '../components/CodeEditor';
import { THEMES } from '../themes';
import type { Challenge } from '../types';

interface ChallengeEditorViewProps {
    challenge: Challenge;
    onBack: () => void;
}

export function ChallengeEditorView({ challenge, onBack }: ChallengeEditorViewProps) {
    const [code, setCode] = useState(challenge.boilerplateCode || '');
    const theme = THEMES['dark']; // Using a fixed theme for now

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#0d1117]">
            {/* Left Panel: Problem Description */}
            <div className="w-1/2 p-4 overflow-y-auto bg-[#1e2125]">
                <ProblemDescription challenge={challenge} />
            </div>

            {/* Right Panel: Code Editor */}
            <div className="w-1/2 flex flex-col p-4">
                {/* Editor Controls */}
                <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white">Change Theme</button>
                        <select className="bg-gray-800 border border-gray-700 text-white rounded-md p-1 focus:outline-none">
                            <option>C++11</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Placeholder for icons */}
                        <button className="p-2 text-gray-400 hover:text-white">&#8942;</button>
                        <button className="p-2 text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-grow h-0">
                    <CodeEditor 
                        code={code}
                        onCodeChange={setCode}
                        theme={theme}
                        errorLine={null}
                        errorColumn={null}
                    />
                </div>
                
                 <div className="flex-shrink-0 text-right text-xs text-gray-500 py-1 pr-2">
                    Line: 8 Col: 2
                </div>

                {/* Editor Actions */}
                <div className="flex justify-between items-center mt-4">
                     <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                           Upload Code as File
                        </button>
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                            <input type="checkbox" className="bg-gray-800 border-gray-600 rounded" />
                            Test against custom input
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-600 transition">
                            Run Code
                        </button>
                         <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition">
                            Submit Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}