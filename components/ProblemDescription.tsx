import React from 'react';
import type { Challenge } from '../types';

interface ProblemDescriptionProps {
  challenge: Challenge;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-3">{title}</h2>
        <div className="text-gray-400 leading-relaxed space-y-4 prose prose-sm prose-invert max-w-none">
            {children}
        </div>
    </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-800 p-3 rounded-md text-sm">
        <code>{children}</code>
    </pre>
);

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ challenge }) => {
    // A simple function to parse and render text that might contain code blocks.
    const renderTextWithCode = (text: string = '') => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="bg-gray-700 text-sm rounded px-1.5 py-0.5 font-mono">{part.slice(1, -1)}</code>;
            }
            return part;
        });
    };
    
    // A simple function to parse and render text with potential code blocks denoted by ```.
    const renderParagraphs = (text: string = '') => {
        const paragraphs = text.split('\n\n');
        return paragraphs.map((para, pIndex) => {
            const codeBlockRegex = /`([^`]+)`/g;
            if (codeBlockRegex.test(para)) {
                 return <CodeBlock key={pIndex}>{para.replace(/`/g, '')}</CodeBlock>
            }
            return <p key={pIndex}>{renderTextWithCode(para)}</p>;
        });
    };

    return (
        <div>
            <Section title="Objective">
                {renderParagraphs(challenge.objective)}
            </Section>

            <Section title="Output Format">
                <p>{renderTextWithCode(challenge.outputFormat)}</p>
            </Section>

            <Section title="Sample Output">
                <CodeBlock>{challenge.sampleOutput}</CodeBlock>
            </Section>
        </div>
    );
};