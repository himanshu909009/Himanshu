import React from 'react';
import { CODE_SNIPPETS } from '../constants';
import type { Language, Snippet } from '../types';

interface SnippetsPanelProps {
    language: Language;
    onInsert: (code: string) => void;
}

const SnippetItem: React.FC<{ snippet: Snippet, onInsert: (code: string) => void }> = ({ snippet, onInsert }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group">
        <h4 className="font-bold text-white text-base mb-1">{snippet.title}</h4>
        <p className="text-gray-400 text-sm mb-3">{snippet.description}</p>
        <button 
            onClick={() => onInsert(snippet.code)}
            className="w-full text-center bg-gray-700 text-gray-300 text-sm font-semibold py-2 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors"
        >
            Insert
        </button>
    </div>
);

export const SnippetsPanel: React.FC<SnippetsPanelProps> = ({ language, onInsert }) => {
    const snippets = CODE_SNIPPETS[language] || [];

    return (
        <div className="h-full p-4 space-y-4 overflow-y-auto">
            {snippets.length > 0 ? (
                snippets.map(snippet => (
                    <SnippetItem key={snippet.title} snippet={snippet} onInsert={onInsert} />
                ))
            ) : (
                <p className="text-gray-500 text-center text-sm pt-4">No snippets available for this language.</p>
            )}
        </div>
    );
};
