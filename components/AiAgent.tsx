
import React from 'react';
import type { Theme } from '../types';

interface AiAgentProps {
    explanation: string | null;
    isLoading: boolean;
    theme: Theme;
}

const AgentAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mr-4 border-2 border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a6 6 0 00-6-6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a6 6 0 016-6" />
        </svg>
    </div>
);

const LoadingDots: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

export const AiAgent: React.FC<AiAgentProps> = ({ explanation, isLoading, theme }) => {
    if (!isLoading && !explanation) {
        return null;
    }

    return (
        <div className={`flex items-start p-4 ${theme.background} border ${theme.border} rounded-md`}>
            <AgentAvatar />
            <div className="flex-grow">
                <h4 className={`font-bold text-sm mb-2 ${theme.text}`}>AI Assistant</h4>
                <div className={`text-sm ${theme.text} prose prose-sm prose-invert max-w-none`}>
                    {isLoading && (
                        <div className="flex items-center text-gray-400">
                            <span className="mr-2">Thinking...</span>
                            <LoadingDots />
                        </div>
                    )}
                    {explanation && (
                         <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: explanation.replace(/\`\`\`(\w+)?\n([\s\S]+?)\n\`\`\`/g, '<pre class="bg-gray-800 p-2 rounded-md"><code>$2</code></pre>') }} />
                    )}
                </div>
            </div>
        </div>
    );
};
