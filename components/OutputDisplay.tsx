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
        return <pre className="text-red-400 whitespace-pre-wrap break-words">{compilation.message}</pre>;
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

const TestResultItem: React.FC<{ result: TestResult; index: number }> = ({ result, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { testCase, status, actualOutput, errorMessage } = result;

    const getStatusChip = () => {
        switch(status) {
            case 'pass': return <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Pass</span>;
            case 'fail': return <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Fail</span>;
            case 'error': return <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Error</span>;
        }
    }

    return (
        <div className={`p-3 rounded-md border ${status === 'pass' ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'}`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center">
                    {getStatusChip()}
                    <span className="ml-3 font-medium text-gray-200">Test Case #{index + 1}</span>
                </div>
                 <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-3 text-sm">
                    {errorMessage ? (
                         <div>
                            <h4 className="font-semibold text-red-400 mb-1">Error:</h4>
                            <pre className="bg-gray-900 p-2 rounded-md text-red-300 whitespace-pre-wrap">{errorMessage}</pre>
                        </div>
                    ) : (
                        <>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-1">Input:</h4>
                            <pre className="bg-gray-900 p-2 rounded-md text-gray-300 whitespace-pre-wrap">{testCase.input || '(empty)'}</pre>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-1">Expected Output:</h4>
                            <pre className="bg-gray-900 p-2 rounded-md text-gray-300 whitespace-pre-wrap">{testCase.expectedOutput}</pre>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-1">Actual Output:</h4>
                            <pre className={`bg-gray-900 p-2 rounded-md whitespace-pre-wrap ${status === 'fail' ? 'text-red-400' : 'text-gray-300'}`}>{actualOutput}</pre>
                        </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
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
            return (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">
                        Test Results: <span className={passCount === totalCount ? 'text-green-400' : 'text-yellow-400'}>{passCount} / {totalCount} passed</span>
                    </h3>
                    {testResults.map((result, index) => (
                        <TestResultItem key={result.testCase.id} result={result} index={index} />
                    ))}
                </div>
            )
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
                <h3 className="text-base font-medium text-gray-200 px-2">{testResults ? 'Test Results' : 'Output'}</h3>
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