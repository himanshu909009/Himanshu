
import React from 'react';
import type { TestCase, Theme } from '../types';

interface TestCasesManagerProps {
    testCases: TestCase[];
    onTestCasesChange: (testCases: TestCase[]) => void;
    theme: Theme;
}

const TestCaseItem: React.FC<{
    testCase: TestCase;
    index: number;
    onUpdate: (field: 'input' | 'expectedOutput', value: string) => void;
    onDelete: () => void;
}> = ({ testCase, index, onUpdate, onDelete }) => {
    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <label htmlFor={`input-${index}`} className="block text-sm font-medium text-gray-400 mb-1">Input</label>
                <textarea
                    id={`input-${index}`}
                    value={testCase.input}
                    onChange={(e) => onUpdate('input', e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-base font-mono focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 disabled:text-gray-400"
                    disabled={testCase.isLocked}
                    spellCheck="false"
                />
            </div>
            <div className="flex-1">
                <label htmlFor={`output-${index}`} className="block text-sm font-medium text-gray-400 mb-1">Expected Output</label>
                <textarea
                    id={`output-${index}`}
                    value={testCase.expectedOutput}
                    onChange={(e) => onUpdate('expectedOutput', e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-base font-mono focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 disabled:text-gray-400"
                    disabled={testCase.isLocked}
                    spellCheck="false"
                />
            </div>
            {!testCase.isLocked && (
                <div className="flex-shrink-0 self-end mb-1">
                    <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export const TestCasesManager: React.FC<TestCasesManagerProps> = ({ testCases, onTestCasesChange, theme }) => {
    
    const handleUpdate = (index: number, field: 'input' | 'expectedOutput', value: string) => {
        const newTestCases = [...testCases];
        newTestCases[index] = { ...newTestCases[index], [field]: value };
        onTestCasesChange(newTestCases);
    };

    const handleAdd = () => {
        const newTestCase: TestCase = {
            id: `custom-${Date.now()}`,
            input: '',
            expectedOutput: '',
        };
        onTestCasesChange([...testCases, newTestCase]);
    };

    const handleDelete = (index: number) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        onTestCasesChange(newTestCases);
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <p className="text-gray-400 text-sm">Define test cases to run your code against.</p>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 text-sm bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Test Case
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {testCases.map((tc, index) => (
                    <div key={tc.id}>
                        <h4 className="text-base font-semibold text-gray-300 mb-2 flex items-center">
                            Test Case {index + 1}
                            {tc.isLocked && (
                                <span className="ml-2 text-gray-500" title="This test case is locked and cannot be edited.">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </h4>
                        <TestCaseItem
                            testCase={tc}
                            index={index}
                            onUpdate={(field, value) => handleUpdate(index, field, value)}
                            onDelete={() => handleDelete(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
