
import React, { useState, useCallback } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { OutputDisplay } from '../components/OutputDisplay';
import { AiAgent } from '../components/AiAgent';
import { LanguageSelector } from '../components/LanguageSelector';
import { LANGUAGES, DEFAULT_CODE } from '../constants';
import { runCodeSimulation, getAiErrorExplanation } from '../services/geminiService';
import type { Language, SimulationOutput, ThemeName, VirtualFile } from '../types';
import { THEMES } from '../themes';

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

const ControlButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = 
({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition ${className}`}>
        {children}
    </button>
);

export function CompilerView() {
    const [language, setLanguage] = useState<Language>('c');
    const [code, setCode] = useState<string>(DEFAULT_CODE.c);
    const [fullInput, setFullInput] = useState<string>("");
    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const handleCodeChange = useCallback((newCode: string) => {
        setCode(newCode);
        if (errorLine !== null) {
            setErrorLine(null);
            setErrorColumn(null);
            setAiExplanation(null);
        }
    }, [errorLine]);

    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage);
        setCode(DEFAULT_CODE[newLanguage]);
        setOutput(null);
        setError(null);
        setFullInput("");
        setErrorLine(null);
        setErrorColumn(null);
        setAiExplanation(null);
    };

    const toggleTheme = () => {
        setTheme(current => current === 'dark' ? 'light' : 'dark');
    };

    const handleClearOutput = () => {
        setOutput(null);
        setError(null);
        setFullInput("");
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
        setAiExplanation(null); 
        setFullInput("");

        const file: VirtualFile = {
            id: '1',
            name: getFileName(language),
            content: code,
        };

        try {
            const result = await runCodeSimulation(language, [file], file.id, "");
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
    
    const handleTerminalSubmit = useCallback(async (newLine: string) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setAiExplanation(null);
        
        const newFullInput = fullInput + newLine + '\n';
        setFullInput(newFullInput);

        const file: VirtualFile = {
            id: '1',
            name: getFileName(language),
            content: code,
        };

        try {
            const result = await runCodeSimulation(language, [file], file.id, newFullInput);
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
    }, [language, code, fullInput, isLoading]);

    const currentThemeObject = THEMES[theme];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 h-[88vh] relative">
                    
                    <div className="md:w-3/5 lg:w-2/3 flex flex-col h-full">
                        <div className={`flex justify-between items-center mb-2 px-2 py-1 ${currentThemeObject.lineNumberBg} rounded-t-md border-b ${currentThemeObject.border}`}>
                            <div className="flex items-center gap-4">
                                <h1 className={`text-lg font-semibold ${currentThemeObject.lineNumber}`}>{getFileName(language)}</h1>
                                <LanguageSelector
                                    languages={LANGUAGES}
                                    selectedLanguage={language}
                                    onLanguageChange={handleLanguageChange}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <ControlButton onClick={toggleTheme}>
                                    {theme === 'dark' ? (
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                                    ) : (
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                    )}
                                </ControlButton>
                                <ControlButton>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                </ControlButton>
                                <button
                                    onClick={handleRunCode}
                                    disabled={isLoading}
                                    className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-500 transition disabled:bg-gray-500/50 disabled:cursor-not-allowed text-base"
                                >
                                    {isLoading ? 'Running...' : 'Run'}
                                </button>
                            </div>
                        </div>
                        <CodeEditor
                            code={code}
                            onCodeChange={handleCodeChange}
                            theme={THEMES[theme]}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                            aiExplanation={aiExplanation}
                            language={language}
                        />
                    </div>

                    <div className="md:w-2/5 lg:w-1/3 h-full flex flex-col">
                        <OutputDisplay 
                            output={output} 
                            isLoading={isLoading} 
                            error={error}
                            onInputSubmit={handleTerminalSubmit}
                            onClear={handleClearOutput}
                            testResults={null}
                            isTesting={false}
                        />
                    </div>


                    {(isAiLoading || aiExplanation) && (
                        <div className="absolute top-4 right-4 z-20 w-full max-w-lg">
                            <AiAgent
                                explanation={aiExplanation}
                                isLoading={isAiLoading}
                                theme={THEMES[theme]}
                                onClose={() => setAiExplanation(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
