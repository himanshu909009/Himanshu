

import React, { useState, useEffect, useRef } from 'react';
import type { SimulationOutput, Theme } from '../types';

interface OutputDisplayProps {
  output: SimulationOutput | null;
  isLoading: boolean;
  error: string | null;
  theme: Theme;
  onInputSubmit: (line: string) => void;
  onClear: () => void;
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
                    if (part.type === 'stdin') {
                        return <span key={index} className="text-blue-300">{part.content}</span>;
                    }
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


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error, theme, onInputSubmit, onClear }) => {
    const [currentLine, setCurrentLine] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalBodyRef = useRef<HTMLDivElement>(null);

    const isExecutionFinished = !output || output.compilation.status === 'error' || (output.output.isExecutionFinished ?? true);
    const showInputPrompt = !isLoading && !error && !isExecutionFinished;

    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
        if (showInputPrompt) {
            inputRef.current?.focus();
        }
    }, [output, isLoading, error, showInputPrompt]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onInputSubmit(currentLine);
        setCurrentLine('');
    };
    
    const renderContent = () => {
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
            return <div className="text-gray-500 italic">Click 'Run' to start the execution.</div>;
        }
        
        return <OutputContent output={output} />;
    };

    return (
        <div className={`flex flex-col h-full ${theme.background} border ${theme.border} rounded-md overflow-hidden`}>
            <div className={`flex justify-between items-center p-2 border-b ${theme.border} ${theme.lineNumberBg}`}>
                <h3 className={`text-lg font-medium ${theme.lineNumber} px-2`}>Output</h3>
                 <button
                    onClick={onClear}
                    className="text-sm text-gray-400 hover:text-white px-3 py-1 border border-gray-600 rounded hover:bg-gray-700 transition"
                 >
                    Clear
                 </button>
            </div>
            <div ref={terminalBodyRef} className={`flex-grow p-4 font-mono text-lg overflow-auto ${theme.text}`} onClick={() => inputRef.current?.focus()}>
                {renderContent()}
                {showInputPrompt && (
                     <form onSubmit={handleFormSubmit} className="flex items-center mt-2">
                        <span className="text-blue-300 mr-2 flex-shrink-0">&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentLine}
                            onChange={(e) => setCurrentLine(e.target.value)}
                            className={`bg-transparent focus:outline-none w-full ${theme.caret}`}
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