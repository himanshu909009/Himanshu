

import React, { useState, useCallback, useMemo } from 'react';
import { ProblemDescription } from '../components/ProblemDescription';
import { CodeEditor } from '../components/CodeEditor';
import { OutputDisplay } from '../components/OutputDisplay';
import { THEMES } from '../themes';
import type { Challenge, SimulationOutput, VirtualFile, Language, TestResult, User, RecentActivityItem, TestCase } from '../types';
import { runCodeSimulation, getAiFailureAnalysis, getAiErrorExplanation } from '../services/geminiService';
import { AiAgent } from '../components/AiAgent';
import { LanguageSelector } from '../components/LanguageSelector';
import { LANGUAGES, DEFAULT_CODE } from '../constants';
import { TemplateSelectorModal } from '../components/TemplateSelectorModal';

interface ChallengeEditorViewProps {
    challenge: Challenge;
    user: User;
    onUserUpdate: (user: User) => void;
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

export function ChallengeEditorView({ challenge, user, onUserUpdate, onBack }: ChallengeEditorViewProps) {
    const successfulSubmission = useMemo(() => 
        user.submissions.find(s => s.challengeId === challenge.id && s.status === 'Accepted'),
        [user.submissions, challenge.id]
    );

    const [language, setLanguage] = useState<Language>(successfulSubmission?.language || 'cpp');

    const getStorageKey = useCallback((lang: Language) => 
        `challenge-editor-code-${challenge.id}-${lang}`,
        [challenge.id]
    );
    
    const [code, setCode] = useState(() => {
        if (successfulSubmission) {
            return successfulSubmission.code;
        }
        const initialLang = 'cpp';
        return localStorage.getItem(getStorageKey(initialLang)) || challenge.boilerplateCode || DEFAULT_CODE[initialLang];
    });
    
    const theme = THEMES['dark'];
    const [isProblemPanelVisible, setIsProblemPanelVisible] = useState(true);
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
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

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
        if (successfulSubmission && newLanguage === successfulSubmission.language) {
            setCode(successfulSubmission.code);
        } else {
            setCode(localStorage.getItem(getStorageKey(newLanguage)) || DEFAULT_CODE[newLanguage]);
        }
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
    
    const handleSelectTemplate = (templateCode: string) => {
        if (window.confirm("This will replace your current code. Are you sure?")) {
            handleCodeChange(templateCode);
        }
        setIsTemplateModalOpen(false);
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
                setIsAiLoading(true);
                try {
                    const explanation = await getAiErrorExplanation(language, code, result.compilation.message);
                    setAiExplanation(explanation);
                } finally {
                    setIsAiLoading(false);
                }
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

        const sampleTestCase: TestCase = {
            id: 'sample-0',
            input: challenge.sampleInput ?? '',
            expectedOutput: challenge.sampleOutput ?? '',
            isLocked: true, // Treat as official to trigger summary view
        };
    
        let testResult: TestResult | null = null;
    
        try {
            const result = await runSingleSimulation(sampleTestCase.input);
            
            let status: TestResult['status'] = 'fail';
            let errorMessage: string | undefined;
    
            if (result.output.stderr) {
                status = 'error';
                errorMessage = result.output.stderr;
            } else if (result.output.stdout.trim() === sampleTestCase.expectedOutput.trim()) {
                status = 'pass';
            }
    
            testResult = {
                testCase: sampleTestCase,
                status,
                actualOutput: result.output.stdout,
                errorMessage,
            };
            results.push(testResult);
            
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during test case execution.";
            testResult = {
                testCase: sampleTestCase,
                status: 'error' as const,
                actualOutput: '',
                errorMessage: errorMessage,
            };
            results.push(testResult);
        }
    
        // Update user submissions
        if (testResult) {
            const isAlreadySolved = user.submissions.find(s => s.challengeId === challenge.id && s.status === 'Accepted');
            const isCurrentSubmissionAccepted = testResult.status === 'pass';

            if (!isAlreadySolved || isCurrentSubmissionAccepted) {
                let submissionStatus: RecentActivityItem['status'];
                switch(testResult.status) {
                    case 'pass':
                        submissionStatus = 'Accepted';
                        break;
                    case 'fail':
                        submissionStatus = 'Wrong Answer';
                        break;
                    case 'error':
                        submissionStatus = 'Time Limit Exceeded'; // This is an assumption.
                        break;
                }
                
                const newSubmission: RecentActivityItem = {
                    id: Date.now(),
                    challengeId: challenge.id,
                    title: challenge.title,
                    status: submissionStatus,
                    timestamp: new Date().toISOString(),
                    code: code,
                    language: language,
                };
        
                const otherSubmissions = user.submissions.filter(s => s.challengeId !== challenge.id);
                
                const updatedUser: User = {
                    ...user,
                    submissions: [newSubmission, ...otherSubmissions],
                };
                onUserUpdate(updatedUser);
            }
        }
    
        setTestResults(results);
    
        if (testResult && testResult.status !== 'pass') {
            setIsAiLoading(true);
            try {
                const isRuntimeError = testResult.status === 'error';
                const actualOutput = isRuntimeError ? (testResult.errorMessage || '') : testResult.actualOutput;
    
                const explanation = await getAiFailureAnalysis(
                    language, 
                    code, 
                    testResult.testCase.input,
                    testResult.testCase.expectedOutput,
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
        }
    
        setIsTesting(false);

    }, [language, code, challenge, user, onUserUpdate]);
    
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

    return (
        <div className="flex h-full relative">
            {isProblemPanelVisible && (
                <div 
                    className="w-2/5 h-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-800 flex-shrink-0 border-r border-gray-700"
                >
                    <button onClick={onBack} className="mb-6 flex items-center text-base text-gray-400 hover:text-white transition group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Practice
                    </button>
                    <ProblemDescription challenge={challenge} />
                </div>
            )}

            <div 
                className="flex flex-col gap-4 h-full p-4 flex-grow"
            >
                {/* Editor Column */}
                <div className="flex-[3] flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-2 px-2 py-1 bg-gray-800 rounded-t-md border-b border-gray-700">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsProblemPanelVisible(!isProblemPanelVisible)}
                                title={isProblemPanelVisible ? "Hide Problem" : "Show Problem"}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
                            >
                                {isProblemPanelVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <LanguageSelector
                                languages={LANGUAGES}
                                selectedLanguage={language}
                                onLanguageChange={handleLanguageChange}
                            />
                             <button
                                onClick={() => setIsTemplateModalOpen(true)}
                                title="Select a template"
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7zm2 2h2a1 1 0 110 2H9a1 1 0 110-2zm0 4h2a1 1 0 110 2H9a1 1 0 110-2z" /></svg>
                            </button>
                        </div>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={handleRunCode}
                                disabled={isLoading || isTesting}
                                className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-500 transition disabled:bg-gray-500/50 disabled:cursor-not-allowed text-base"
                            >
                                {isLoading ? 'Running...' : 'Run'}
                            </button>
                            <button 
                                onClick={handleSubmitCode}
                                disabled={isLoading || isTesting}
                                className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition disabled:bg-green-500/50 disabled:cursor-not-allowed text-base"
                            >
                                {isTesting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-grow min-h-0">
                        <CodeEditor 
                            code={code}
                            onCodeChange={handleCodeChange}
                            theme={theme}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                            aiExplanation={aiExplanation}
                            language={language}
                            storageKey={getStorageKey(language)}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className="flex-[2] flex flex-col min-h-0">
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

            <TemplateSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleSelectTemplate}
                language={language}
            />
        </div>
    );
}