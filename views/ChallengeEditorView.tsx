
import React, { useState, useCallback, useRef } from 'react';
import { ProblemDescription } from '../components/ProblemDescription';
import { CodeEditor } from '../components/CodeEditor';
import { OutputDisplay } from '../components/OutputDisplay';
import { THEMES } from '../themes';
import type { Challenge, SimulationOutput, VirtualFile, Language } from '../types';
import { runCodeSimulation, getAiErrorExplanation, getAiCodeFeedback } from '../services/geminiService';
import { AiAgent } from '../components/AiAgent';
import { LanguageSelector } from '../components/LanguageSelector';
import { LANGUAGES, DEFAULT_CODE } from '../constants';


interface ChallengeEditorViewProps {
    challenge: Challenge;
    onBack: () => void;
}

const getFileName = (language: Language) => {
    switch (language) {
        case 'python': return 'main.py';
        case 'javascript': return 'main.js';
        case 'java': return 'Main.java';
        case 'cpp': return 'main.cpp';
        case 'c': return 'main.c';
        default: return 'file.txt';
    }
};

export function ChallengeEditorView({ challenge, onBack }: ChallengeEditorViewProps) {
    const [language, setLanguage] = useState<Language>('cpp');
    const [code, setCode] = useState(challenge.boilerplateCode || '');
    const theme = THEMES['dark']; // Using a fixed theme for now

    // State for resizable panels
    const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Initial width in percentage
    const containerRef = useRef<HTMLDivElement>(null);

    // State from CompilerView for execution logic
    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState<string>("");
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (errorLine !== null) {
            setErrorLine(null);
            setErrorColumn(null);
            setAiExplanation(null);
        }
    };
    
    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage);
        setCode(DEFAULT_CODE[newLanguage]);
        setOutput(null);
        setError(null);
        setInput("");
        setErrorLine(null);
        setErrorColumn(null);
        setAiExplanation(null);
    };

    const handleClearOutput = () => {
        setOutput(null);
        setError(null);
        setInput("");
        setAiExplanation(null);
    };

    const handleRunCode = useCallback(async () => {
        if (!code.trim()) {
            setError("Code cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutput(null);
        setErrorLine(null);
        setErrorColumn(null);
        setInput("");
        setAiExplanation(null);

        const file: VirtualFile = { id: '1', name: getFileName(language), content: code };

        try {
            const result = await runCodeSimulation(language, [file], file.id, "");
            setOutput(result);
            setIsAiLoading(true);
            if (result.compilation.status === 'error') {
                setErrorLine(result.compilation.line ?? null);
                setErrorColumn(result.compilation.column ?? null);
                const explanation = await getAiErrorExplanation(language, code, result.compilation.message);
                setAiExplanation(explanation);
            } else {
                const feedback = await getAiCodeFeedback(language, code);
                setAiExplanation(feedback);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setIsAiLoading(false);
        }
    }, [language, code]);
    
    const handleTerminalSubmit = useCallback(async (newLine: string) => {
        if (isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setAiExplanation(null);
        
        const newInput = input + newLine + '\n';
        setInput(newInput);

        const file: VirtualFile = { id: '1', name: getFileName(language), content: code };

        try {
            const result = await runCodeSimulation(language, [file], file.id, newInput);
            setOutput(result);
            setIsAiLoading(true);
            if (result.compilation.status === 'error') {
                 setErrorLine(result.compilation.line ?? null);
                 setErrorColumn(result.compilation.column ?? null);
                 const explanation = await getAiErrorExplanation(language, code, result.compilation.message);
                 setAiExplanation(explanation);
            } else {
                const feedback = await getAiCodeFeedback(language, code);
                setAiExplanation(feedback);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setIsAiLoading(false);
        }
    }, [language, code, input, isLoading]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        
        const startX = e.clientX;
        const startWidth = (containerRef.current?.querySelector('.left-panel') as HTMLElement)?.offsetWidth || 0;
        const containerWidth = containerRef.current?.offsetWidth || 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            let newWidthPercent = ((startWidth + dx) / containerWidth) * 100;
            
            // Clamp values between 20% and 80%
            newWidthPercent = Math.max(20, Math.min(80, newWidthPercent));

            setLeftPanelWidth(newWidthPercent);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const showOutput = output || error || isLoading;

    return (
        <div ref={containerRef} className="flex h-full relative">
            {/* Left Panel: Problem Description */}
            <div 
                className="left-panel h-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-800 rounded-lg"
                style={{ width: `${leftPanelWidth}%` }}
            >
                <button onClick={onBack} className="mb-6 flex items-center text-base text-gray-400 hover:text-white transition group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to List of Experiments
                </button>
                <ProblemDescription challenge={challenge} />
            </div>

            {/* Resizer */}
            <div 
                onMouseDown={handleMouseDown}
                className="w-4 h-full cursor-col-resize bg-gray-700 hover:bg-blue-600 active:bg-blue-500 transition-colors duration-200 flex-shrink-0 flex items-center justify-center group"
            >
                <div className="flex flex-col space-y-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-2 h-1 bg-gray-500 group-hover:bg-white rounded-sm transition-colors duration-200"></div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Editor + Output */}
            <div 
                className="h-full grid grid-rows-[auto_1fr_auto] bg-gray-800 rounded-lg overflow-hidden"
                style={{ width: `${100 - leftPanelWidth}%` }}
            >
                {/* Header */}
                 <div className="flex justify-between items-center p-3 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                        <LanguageSelector
                            languages={LANGUAGES}
                            selectedLanguage={language}
                            onLanguageChange={handleLanguageChange}
                        />
                    </div>
                </div>
                
                {/* Main Content */}
                <div className={`grid ${showOutput ? 'grid-rows-3' : 'grid-rows-1'} gap-4 p-4 min-h-0`}>
                    <div className={`${showOutput ? 'row-span-2' : 'row-span-1'} min-h-0 flex`}>
                        <CodeEditor 
                            code={code}
                            onCodeChange={handleCodeChange}
                            theme={theme}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                            aiExplanation={aiExplanation}
                        />
                    </div>
                    {showOutput && (
                        <div className="row-span-1 min-h-0 flex">
                            <OutputDisplay
                                output={output}
                                isLoading={isLoading}
                                error={error}
                                theme={theme}
                                onInputSubmit={handleTerminalSubmit}
                                onClear={handleClearOutput}
                            />
                        </div>
                    )}
                </div>
                
                {/* Footer Actions */}
                <div className="flex justify-between items-center p-3 border-t border-gray-700">
                     <div className="flex items-center gap-4 text-base">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                           Upload Code as File
                        </button>
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                            <input type="checkbox" className="bg-gray-900 border-gray-700 rounded focus:ring-blue-500 text-blue-500" />
                            Test against custom input
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleRunCode}
                            disabled={isLoading}
                            className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed text-base"
                        >
                            {isLoading ? 'Running...' : 'Run Code'}
                        </button>
                         <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition text-base">
                            Submit Code
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Agent as a popup */}
            {(isAiLoading || aiExplanation) && (
                <div className="absolute top-4 right-4 z-20 w-full max-w-lg">
                    <AiAgent
                        explanation={aiExplanation}
                        isLoading={isAiLoading}
                        theme={theme}
                        onClose={() => setAiExplanation(null)}
                    />
                </div>
            )}
        </div>
    );
}