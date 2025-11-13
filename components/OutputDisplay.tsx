import React, { useState, useEffect, useRef } from 'react';
import type { SimulationOutput, TestResult } from '../types';

interface OutputDisplayProps {
  output: SimulationOutput | null;
  isLoading: boolean;
  error: string | null;
  onInputSubmit: (line: string) => void;
  onClear: () => void;
  testResults: TestResult[] | null;
  isTesting: boolean;
}

const OutputContent: React.FC<{ output: SimulationOutput }> = ({ output }) => {
    const { compilation, output: programOutput } = output;

    if (compilation.status === 'error') {
        const { message, line, column } = compilation;
        return (
            <div>
                <div className="bg-red-900/30 border border-red-700 p-3 rounded-md font-mono">
                    <p className="font-sans font-bold text-red-400 mb-2 text-base">Compilation Error</p>
                    {line && (
                        <p className="text-sm text-yellow-400 mb-2">
                            Location: Line {line}{column ? `, Column ${column}` : ''}
                        </p>
                    )}
                    <pre className="text-red-300 whitespace-pre-wrap break-words text-sm">{message}</pre>
                </div>
            </div>
        );
    }

    if (programOutput.transcript && programOutput.transcript.length > 0) {
        return (
            <pre className="whitespace-pre-wrap break-words">
                {programOutput.transcript.map((part, index) => {
                    if (part.type === 'stderr') {
                        return <span key={index} className="text-yellow-400">{part.content}</span>;
                    }
                    return <span key={index}>{part.content}</span>;
                })}
            </pre>
        );
    }

    let content = programOutput.stdout || programOutput.stderr;
    const className = programOutput.stderr ? 'text-yellow-400' : '';
    
    if (!content && compilation.status === 'success') {
      content = "Execution successful, but no output (stdout) was produced.";
    }

    return <pre className={`${className} whitespace-pre-wrap break-words`}>{content}</pre>;
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error, onInputSubmit, onClear, testResults, isTesting }) => {
    const [currentLine, setCurrentLine] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    
    const isExecutionFinished = !output || output.compilation.status === 'error' || (output.output.isExecutionFinished ?? true);
    const showInputPrompt = !isLoading && !error && !isExecutionFinished && !testResults;

    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
        if (showInputPrompt) {
            inputRef.current?.focus();
        }
    }, [output, isLoading, error, showInputPrompt, testResults]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onInputSubmit(currentLine);
        setCurrentLine('');
    };
    
    const renderContent = () => {
        if (isTesting) {
             return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                     <span className="ml-4 text-gray-300">Running tests...</span>
                </div>
            );
        }

        if (testResults) {
            const passCount = testResults.filter(r => r.status === 'pass').length;
            const totalCount = testResults.length;
            const allPassed = passCount === totalCount;

            let finalStatusText: string;
            let finalStatusColor: string;

            if (allPassed) {
                finalStatusText = "Accepted";
                finalStatusColor = "text-green-400";
            } else {
                const firstFail = testResults.find(r => r.status !== 'pass');
                if (firstFail?.status === 'error') {
                    finalStatusText = "Runtime Error";
                } else {
                    finalStatusText = "Wrong Answer";
                }
                finalStatusColor = "text-red-400";
            }
            
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className={`text-3xl font-bold mb-2 ${finalStatusColor}`}>{finalStatusText}</h3>
                    <p className="text-gray-300 text-lg">
                        Your submission has been processed.
                    </p>
                    <p className="text-gray-400 mt-2">
                        Passed {passCount} of {totalCount} test cases.
                    </p>
                </div>
            );
        }

        if (isLoading && !output) {
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
            return <div className="text-gray-500 italic">Run code or tests to see the output.</div>;
        }
        
        return <OutputContent output={output} />;
    };

    return (
        <div className="flex flex-col h-full bg-[#2d3748] border border-slate-600 rounded-md overflow-hidden text-gray-200">
            <div className="flex justify-between items-center p-2 border-b border-slate-600 bg-slate-700">
                <h3 className="text-base font-medium text-gray-200 px-2">{testResults ? 'Submission Status' : 'Output'}</h3>
                 <button
                    onClick={onClear}
                    className="text-sm text-gray-300 hover:text-white px-3 py-1 border border-slate-500 rounded hover:bg-slate-600 transition"
                 >
                    Clear
                 </button>
            </div>
            <div ref={terminalBodyRef} className="flex-grow p-4 font-mono text-base overflow-auto" onClick={() => inputRef.current?.focus()}>
                {renderContent()}
                {showInputPrompt && (
                     <form onSubmit={handleFormSubmit} className="flex items-center mt-2">
                        <span className="text-gray-300 mr-2 flex-shrink-0">&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentLine}
                            onChange={(e) => setCurrentLine(e.target.value)}
                            className="bg-transparent focus:outline-none w-full caret-gray-200"
                            autoFocus
                            disabled={isLoading}
                            spellCheck="false"
                        />
                     </form>
                )}
                 {isLoading && output && (
                    <div className="flex items-center mt-2">
                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
