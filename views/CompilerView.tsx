import React, { useState, useCallback } from 'react';
import { LanguageSelector } from '../components/LanguageSelector';
import { CodeEditor } from '../components/CodeEditor';
import { InputSection } from '../components/InputSection';
import { OutputDisplay } from '../components/OutputDisplay';
import { LANGUAGES, DEFAULT_CODE } from '../constants';
import { runCodeSimulation } from '../services/geminiService';
import type { Language, SimulationOutput, ThemeName } from '../types';
import { ThemeSelector } from '../components/ThemeSelector';
import { THEMES } from '../themes';

const InfoSection = () => (
    <div className="bg-gray-800 p-8 rounded-lg mt-8 text-gray-400">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Online Compiler</h2>
        <p className="mb-4">
            Welcome to our online compiler, the perfect platform to run and test your code efficiently. Our tool makes coding easy for developers of any skill level, whether you're a beginner or experienced.
        </p>
        <h3 className="text-lg font-semibold text-white mb-2">Our compiler will allow you to:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-300">
            <li><span className="text-gray-400">Run your code fast</span></li>
            <li><span className="text-gray-400">Get detailed output and error descriptions after each run</span></li>
            <li><span className="text-gray-400">You can also check the time and memory usage of your code</span></li>
            <li><span className="text-gray-400">Write your code faster using the auto-complete feature</span></li>
            <li><span className="text-gray-400">Use and import libraries</span></li>
            <li><span className="text-gray-400">Customize the editor with your favorite theme</span></li>
            <li><span className="text-gray-400">Read / Write and edit files like csv, text etc.</span></li>
        </ul>
    </div>
);


export function CompilerView() {
    const [language, setLanguage] = useState<Language>('python');
    const [code, setCode] = useState<string>(DEFAULT_CODE.python);
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);

    const handleLanguageChange = (selectedLanguage: Language) => {
        setLanguage(selectedLanguage);
        setCode(DEFAULT_CODE[selectedLanguage] || '');
        setOutput(null);
        setError(null);
        setErrorLine(null);
        setErrorColumn(null);
    };
    
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (errorLine !== null) {
            setErrorLine(null);
            setErrorColumn(null);
        }
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
        try {
            const result = await runCodeSimulation(code, language, input);
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
    }, [code, language, input]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 h-[70vh]">
                    {/* Left Pane */}
                    <div className="flex flex-col gap-4 lg:w-3/5 h-full">
                         <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">Online Compiler</h1>
                            <LanguageSelector
                                languages={LANGUAGES}
                                selectedLanguage={language}
                                onLanguageChange={handleLanguageChange}
                            />
                        </div>
                        <CodeEditor
                            code={code}
                            onCodeChange={handleCodeChange}
                            theme={THEMES[theme]}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                        />
                    </div>

                    {/* Right Pane */}
                    <div className="flex flex-col gap-4 lg:w-2/5 h-full">
                         <div className="flex justify-end items-center gap-4 p-2 rounded-md">
                            <ThemeSelector
                                themes={THEMES}
                                selectedTheme={theme}
                                onThemeChange={setTheme}
                            />
                            <button
                                onClick={handleRunCode}
                                disabled={isLoading}
                                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Running...' : 'Run'}
                            </button>
                        </div>
                        <InputSection input={input} onInputChange={setInput} />
                        <OutputDisplay output={output} isLoading={isLoading} error={error} />
                    </div>
                </div>
                
                <InfoSection />

            </div>
        </div>
    );
}