

import React, { useState, useCallback } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { OutputDisplay } from '../components/OutputDisplay';
import { AiAgent } from '../components/AiAgent';
import { LanguageSelector } from '../components/LanguageSelector';
import { ThemeSelector } from '../components/ThemeSelector';
import { LANGUAGES, DEFAULT_CODE } from '../constants';
import { runCodeSimulation, getAiErrorExplanation } from '../services/geminiService';
import type { Language, SimulationOutput, ThemeName, VirtualFile } from '../types';
import { THEMES } from '../themes';
import { TemplateSelectorModal } from '../components/TemplateSelectorModal';

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

const ControlButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; title?: string }> = 
({ children, onClick, className = '', title }) => (
    <button onClick={onClick} title={title} className={`p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition ${className}`}>
        {children}
    </button>
);

export function CompilerView() {
    const [language, setLanguage] = useState<Language>('c');
    const getStorageKey = (lang: Language) => `compiler-view-code-${lang}`;

    const [code, setCode] = useState<string>(() => {
        return localStorage.getItem(getStorageKey(language)) || DEFAULT_CODE[language];
    });
    const [fullInput, setFullInput] = useState<string>("");
    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

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
        setCode(localStorage.getItem(getStorageKey(newLanguage)) || DEFAULT_CODE[newLanguage]);
        setOutput(null);
        setError(null);
        setFullInput("");
        setErrorLine(null);
        setErrorColumn(null);
        setAiExplanation(null);
    };

    const handleClearOutput = () => {
        setOutput(null);
        setError(null);
        setAiExplanation(null);
    };
    
    const handleSelectTemplate = (templateCode: string) => {
        if (window.confirm("This will replace your current code. Are you sure?")) {
            handleCodeChange(templateCode);
        }
        setIsTemplateModalOpen(false);
    };

    const handleRunCode = useCallback(async (inputToUse: string) => {
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

        const file: VirtualFile = {
            id: '1',
            name: getFileName(language),
            content: code,
        };

        try {
            const result = await runCodeSimulation(language, [file], file.id, inputToUse);
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

        const newFullInput = fullInput + newLine + '\n';
        setFullInput(newFullInput);
        await handleRunCode(newFullInput);
    }, [fullInput, handleRunCode, isLoading]);
    

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
                            <div className="flex items-center gap-4">
                                <ThemeSelector
                                    themes={{ dark: THEMES.dark, light: THEMES.light }}
                                    selectedTheme={theme}
                                    onThemeChange={setTheme}
                                />
                                <ControlButton onClick={() => setIsTemplateModalOpen(true)} title="Select a template">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7zm2 2h2a1 1 0 110 2H9a1 1 0 110-2zm0 4h2a1 1 0 110 2H9a1 1 0 110-2z" /></svg>
                                </ControlButton>
                                <button
                                    onClick={() => { setFullInput(""); handleRunCode(""); }}
                                    disabled={isLoading}
                                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition disabled:bg-green-500/50 disabled:cursor-not-allowed text-base"
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
                            storageKey={getStorageKey(language)}
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
            <TemplateSelectorModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleSelectTemplate}
                language={language}
            />
        </div>
    );
}
