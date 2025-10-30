import React from 'react';
import type { Challenge } from '../types';

interface ProblemDescriptionProps {
  challenge: Challenge;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-200 mb-3">{title}</h2>
        <div className="text-gray-300 leading-relaxed space-y-4 max-w-none">
            {children}
        </div>
    </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-900 p-3 rounded-md text-2xl">
        <code>{children}</code>
    </pre>
);

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ challenge }) => {
    // A simple function to parse and render text that might contain inline code.
    const renderTextWithCode = (text: string = '') => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="bg-gray-700 text-2xl rounded px-1.5 py-0.5 font-mono">{part.slice(1, -1)}</code>;
            }
            return part;
        });
    };
    
    // Renders paragraphs and code blocks from text.
    const renderContent = (text: string = '') => {
        const paragraphs = text.split('\n\n');
        const elements: React.ReactNode[] = [];
        
        paragraphs.forEach((para, pIndex) => {
            const lines = para.split('\n');
            let currentParagraph: string[] = [];

            lines.forEach((line, lIndex) => {
                const isCodeLine = line.startsWith('`') && line.endsWith('`');
                
                if (isCodeLine) {
                    if (currentParagraph.length > 0) {
                        elements.push(<p key={`${pIndex}-${lIndex}-p`} className="text-2xl">{renderTextWithCode(currentParagraph.join(' '))}</p>);
                        currentParagraph = [];
                    }
                    elements.push(<CodeBlock key={`${pIndex}-${lIndex}-c`}>{line.slice(1, -1)}</CodeBlock>);
                } else {
                    currentParagraph.push(line);
                }
            });

            if (currentParagraph.length > 0) {
                elements.push(<p key={`${pIndex}-last-p`} className="text-2xl">{renderTextWithCode(currentParagraph.join(' '))}</p>);
            }
        });
        return elements;
    };

    return (
        <div>
            <Section title="Objective">
                {renderContent(challenge.objective)}
            </Section>

            <Section title="Output Format">
                <p className="text-2xl">{renderTextWithCode(challenge.outputFormat)}</p>
            </Section>

            <Section title="Sample Output">
                <CodeBlock>{challenge.sampleOutput}</CodeBlock>
            </Section>
        </div>
    );
};