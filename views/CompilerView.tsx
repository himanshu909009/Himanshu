import React, { useState, useCallback } from 'react';
import { LanguageSelector } from '../components/LanguageSelector';
import { CodeEditor } from '../components/CodeEditor';
import { InputSection } from '../components/InputSection';
import { OutputDisplay } from '../components/OutputDisplay';
import { LANGUAGES, DEFAULT_CODE } from '../constants';
import { runCodeSimulation } from '../services/geminiService';
import type { Language, SimulationOutput, ThemeName, VirtualFile } from '../types';
import { ThemeSelector } from '../components/ThemeSelector';
import { THEMES } from '../themes';
import { FileManager } from '../components/FileManager';
import { StatsDisplay } from '../components/StatsDisplay';

const getFileExtension = (language: Language) => {
    switch (language) {
        case 'python': return 'py';
        case 'javascript': return 'js';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        case 'c': return 'c';
        default: return 'txt';
    }
};

const createDefaultFile = (language: Language): VirtualFile => ({
    id: `main_${Date.now()}`,
    name: `main.${getFileExtension(language)}`,
    content: DEFAULT_CODE[language],
});

export function CompilerView() {
    const [language, setLanguage] = useState<Language>('python');
    const [files, setFiles] = useState<VirtualFile[]>([createDefaultFile('python')]);
    const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<SimulationOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [errorLine, setErrorLine] = useState<number | null>(null);
    const [errorColumn, setErrorColumn] = useState<number | null>(null);

    const activeFile = files.find(f => f.id === activeFileId) || files[0];

    const handleLanguageChange = (selectedLanguage: Language) => {
        setLanguage(selectedLanguage);
        const newFile = createDefaultFile(selectedLanguage);
        setFiles([newFile]);
        setActiveFileId(newFile.id);
        setOutput(null);
        setError(null);
        setErrorLine(null);
        setErrorColumn(null);
    };
    
    const handleCodeChange = (newCode: string) => {
        setFiles(currentFiles => 
            currentFiles.map(file => 
                file.id === activeFileId ? { ...file, content: newCode } : file
            )
        );
        if (errorLine !== null) {
            setErrorLine(null);
            setErrorColumn(null);
        }
    };
    
    const handleAddFile = () => {
        const newFileName = `file${files.length + 1}.${getFileExtension(language)}`;
        const newFile: VirtualFile = {
            id: `${newFileName}_${Date.now()}`,
            name: newFileName,
            content: `// ${newFileName}\n`
        };
        setFiles(currentFiles => [...currentFiles, newFile]);
        setActiveFileId(newFile.id);
    };

    const handleDeleteFile = (fileId: string) => {
        if (files.length === 1) return; // Cannot delete the last file
        setFiles(currentFiles => {
            const newFiles = currentFiles.filter(f => f.id !== fileId);
            if (activeFileId === fileId) {
                setActiveFileId(newFiles[0].id);
            }
            return newFiles;
        });
    };

    const handleRunCode = useCallback(async () => {
        if (!activeFile.content.trim()) {
            setError("Code cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutput(null);
        setErrorLine(null);
        setErrorColumn(null);
        try {
            const result = await runCodeSimulation(language, files, activeFileId, input);
            setOutput(result);
            if (result.compilation.status === 'error') {
                setErrorLine(result.compilation.line ?? null);
                setErrorColumn(result.compilation.column ?? null);
            }
            if (result.output.files && result.output.files.length > 0) {
                // This logic merges the returned files with the existing file state
                setFiles(currentFiles => {
                    const newFilesMap = new Map(currentFiles.map(f => [f.name, f]));
                    result.output.files?.forEach(updatedFile => {
                        // Check if a file with the same name exists to update it,
                        // otherwise it's a new file created by the code.
                        const existingFile = currentFiles.find(f => f.name === updatedFile.name);
                        newFilesMap.set(updatedFile.name, {
                            ...updatedFile,
                            id: existingFile?.id || `${updatedFile.name}_${Date.now()}` // Preserve old ID or create new
                        });
                    });
                    return Array.from(newFilesMap.values());
                });
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [language, files, activeFileId, input]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4 h-[85vh]">
                    {/* Left Pane: File Manager */}
                    <div className="lg:w-1/6 h-full">
                       <FileManager 
                            files={files}
                            activeFileId={activeFileId}
                            onFileSelect={setActiveFileId}
                            onAddFile={handleAddFile}
                            onDeleteFile={handleDeleteFile}
                       />
                    </div>

                    {/* Center Pane: Code Editor */}
                    <div className="flex flex-col gap-4 lg:w-3/5 h-full">
                         <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">{activeFile.name}</h1>
                            <LanguageSelector
                                languages={LANGUAGES}
                                selectedLanguage={language}
                                onLanguageChange={handleLanguageChange}
                            />
                        </div>
                        <CodeEditor
                            code={activeFile.content}
                            onCodeChange={handleCodeChange}
                            theme={THEMES[theme]}
                            errorLine={errorLine}
                            errorColumn={errorColumn}
                        />
                    </div>

                    {/* Right Pane: Controls, I/O, Stats */}
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
                        <StatsDisplay output={output} />
                        <OutputDisplay output={output} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </div>
        </div>
    );
}