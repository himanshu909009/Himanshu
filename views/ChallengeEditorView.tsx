

import React, { useState, useCallback, useRef } from 'react';
import { ProblemDescription } from '../components/ProblemDescription';
import { CodeEditor } from '../components/CodeEditor';
import { OutputDisplay } from '../components/OutputDisplay';
import { THEMES } from '../themes';
import type { Challenge, SimulationOutput, VirtualFile, Language, TestResult } from '../types';
import { runCodeSimulation, getAiFailureAnalysis, getAiCodeFeedback, getAiErrorExplanation } from '../services/geminiService';
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
    const theme = THEMES['dark'];

    const [leftPanelWidth, setLeftPanelWidth] = useState(40);
    const containerRef = useRef<HTMLDivElement>(null);

    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
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
        setTestResults(null);
        setErrorLine(null);
        setErrorColumn(null);
        setAiExplanation(null);
    };

    const handleClearOutput = () => {
        setOutput(null);
        setError(null);
        setInput("");
        setTestResults(null);
        setAiExplanation(null);
    };
    
    const runSingleSimulation = async (simulationInput: string): Promise<SimulationOutput> => {
        const file: VirtualFile = { id: '1', name: getFileName(language), content: code };
        return runCodeSimulation(language, [file], file.id, simulationInput);
    };

    const handleRunCode = useCallback(async () => {
        if (!code.trim()) {
            setError("Code cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutput(null);
        setTestResults(null);
        setErrorLine(null);
        setErrorColumn(null);
        setInput("");
        setAiExplanation(null);

        try {
            const result = await runSingleSimulation("");
            setOutput(result);
            if (result.compilation.status === 'error') {
                setErrorLine(result.compilation.line ?? null);
                setErrorColumn(result.compilation.column ?? null);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [language, code]);

    const handleSubmitCode = useCallback(async () => {
        if (!code.trim()) {
            setError("Code cannot be empty.");
            return;
        }
        setIsTesting(true);
        setOutput(null);
        setTestResults(null);
        setError(null);
        setErrorLine(null);
        setErrorColumn(null);
        setAiExplanation(null);
        
        const results: TestResult[] = [];
        let firstFailedResult: TestResult | null = null;
        
        const compilationCheck = await runSingleSimulation("");
        if (compilationCheck.compilation.status === 'error') {
            setOutput(compilationCheck);
            setErrorLine(compilationCheck.compilation.line ?? null);
            setErrorColumn(compilationCheck.compilation.column ?? null);
            setIsTesting(false);
            
            setIsAiLoading(true);
            try {
                const explanation = await getAiErrorExplanation(language, code, compilationCheck.compilation.message);
                setAiExplanation(explanation);
            } catch(e) {
                console.error("Failed to get AI explanation for compile error", e);
            } finally {
                setIsAiLoading(false);
            }
            return;
        }

        for (const testCase of challenge.testCases || []) {
            try {
                const result = await runSingleSimulation(testCase.input);
                
                let status: TestResult['status'] = 'fail';
                let errorMessage: string | undefined;

                if (result.output.stderr) {
                    status = 'error';
                    errorMessage = result.output.stderr;
                } else if (result.output.stdout.trim() === testCase.expectedOutput.trim()) {
                    status = 'pass';
                }

                const testResult: TestResult = {
                    testCase,
                    status,
                    actualOutput: result.output.stdout,
                    errorMessage,
                };

                results.push(testResult);

                if (status !== 'pass' && !firstFailedResult) {
                    firstFailedResult = testResult;
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during test case execution.";
                const errorResult = {
                    testCase,
                    status: 'error' as const,
                    actualOutput: '',
                    errorMessage: errorMessage,
                };
                results.push(errorResult);
                if (!firstFailedResult) {
                    firstFailedResult = errorResult;
                }
            }
        }

        setTestResults(results);

        if (firstFailedResult) {
            setIsAiLoading(true);
            try {
                const isRuntimeError = firstFailedResult.status === 'error';
                const actualOutput = isRuntimeError ? (firstFailedResult.errorMessage || '') : firstFailedResult.actualOutput;

                const explanation = await getAiFailureAnalysis(
                    language, 
                    code, 
                    firstFailedResult.testCase.input,
                    firstFailedResult.testCase.expectedOutput,
                    actualOutput,
                    isRuntimeError
                );
                setAiExplanation(explanation);
            } catch (e) {
                console.error("Failed to get AI analysis", e);
                setAiExplanation("Sorry, I couldn't analyze this failure.");
            } finally {
                setIsAiLoading(false);
            }
        } else {
            setIsAiLoading(true);
            try {
                const feedback = await getAiCodeFeedback(language, code);
                setAiExplanation(feedback);
            } catch(e) {
                console.error("Failed to get AI feedback", e);
            } finally {
                setIsAiLoading(false);
            }
        }

        setIsTesting(false);

    }, [language, code, challenge.testCases]);
    
    const handleTerminalSubmit = useCallback(async (newLine: string) => {
        if (isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setTestResults(null);
        
        const newInput = input + newLine + '\n';
        setInput(newInput);

        try {
            const result = await runSingleSimulation(newInput);
            setOutput(result);
             if (result.compilation.status === 'error') {
                 setErrorLine(result.compilation.line ?? null);
                 setErrorColumn(result.compilation.column ?? null);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
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

    return (
        <div ref={containerRef} className="flex h-full relative">
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

            <div 
                className="h-full grid grid-rows-[auto_1fr_auto] bg-gray-800 rounded-lg overflow-hidden"
                style={{ width: `${100 - leftPanelWidth}%` }}
            >
                 <div className="flex justify-between items-center p-3 border-b border-gray-700">
                    <LanguageSelector
                        languages={LANGUAGES}
                        selectedLanguage={language}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>
                
                <div className="grid grid-rows-3 gap-4 p-4 min-h-0">
                    <div className="row-span-2 min-h-0 flex">
                        <CodeEditor 
                            code={code}
                            onCodeChange={handleCodeChange}
                            theme={theme}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                            aiExplanation={aiExplanation}
                            // Fix: Pass language to CodeEditor
                            language={language}
                        />
                    </div>
                    <div className="row-span-1 min-h-0 flex">
                        <OutputDisplay
                            output={output}
                            isLoading={isLoading}
                            isTesting={isTesting}
                            error={error}
                            onInputSubmit={handleTerminalSubmit}
                            onClear={handleClearOutput}
                            testResults={testResults}
                        />
                    </div>
                </div>
                
                <div className="flex justify-end items-center p-3 border-t border-gray-700 gap-4">
                    <button 
                        onClick={handleRunCode}
                        disabled={isLoading || isTesting}
                        className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-500 transition disabled:bg-gray-500/50 disabled:cursor-not-allowed text-base"
                    >
                        {isLoading ? 'Running...' : 'Run Code'}
                    </button>
                    <button 
                        onClick={handleSubmitCode}
                        disabled={isLoading || isTesting}
                        className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition disabled:bg-green-500/50 disabled:cursor-not-allowed text-base"
                    >
                        {isTesting ? 'Submitting...' : 'Submit Code'}
                    </button>
                </div>
            </div>

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