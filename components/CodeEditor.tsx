import React, { useRef, useLayoutEffect } from 'react';
import type { Theme } from '../types';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme: Theme;
  errorLine: number | null;
  errorColumn: number | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, theme, errorLine, errorColumn }) => {
  const lineNumbers = code.split('\n').map((_, index) => index + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  });

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const renderHighlightedCode = () => {
    if (errorLine === null) return <>{code}{' '}</>;

    const lines = code.split('\n');
    if (errorLine > lines.length) return <>{code}{' '}</>;
    
    const lineIndex = errorLine - 1;

    return (
        <>
            {lines.slice(0, lineIndex).join('\n')}
            {lineIndex > 0 ? '\n' : ''}
            {(() => {
                const line = lines[lineIndex];
                if (errorColumn !== null && errorColumn > 0 && errorColumn <= line.length + 1) {
                    const col = errorColumn - 1;
                    return (
                        <>
                            {line.substring(0, col)}
                            <span className="bg-red-500 bg-opacity-40 rounded-sm">{line.substring(col, col + 1) || ' '}</span>
                            {line.substring(col + 1)}
                        </>
                    );
                }
                return <span className="bg-red-500 bg-opacity-30">{line || ' '}</span>;
            })()}
            {lineIndex < lines.length - 1 ? '\n' : ''}
            {lines.slice(lineIndex + 1).join('\n')}
        </>
    );
  };
      
  const commonEditorClasses = "w-full h-full p-4 font-mono text-sm resize-none focus:outline-none whitespace-pre-wrap break-words overflow-auto";

  return (
    <div className={`flex-grow flex ${theme.background} ${theme.border} border rounded-md overflow-hidden`}>
        <div className={`py-4 pl-2 pr-4 text-right ${theme.lineNumber} select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} font-mono text-sm`}>
            {lineNumbers.map(num => (
                <div 
                    key={num} 
                    className={`px-2 rounded-l-sm transition-colors duration-200 ${
                        num === errorLine ? 'bg-red-500 bg-opacity-30 text-white' : ''
                    }`}
                >
                    {num}
                </div>
            ))}
        </div>
        <div className="relative flex-grow h-full">
            <pre
              ref={preRef}
              aria-hidden="true"
              className={`${commonEditorClasses} ${theme.text} absolute top-0 left-0 pointer-events-none`}
            >
              {renderHighlightedCode()}
            </pre>
            <textarea
              ref={textareaRef}
              id="code-editor"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onScroll={handleScroll}
              className={`${commonEditorClasses} bg-transparent text-transparent ${theme.caret} relative z-10`}
              spellCheck="false"
              aria-label="Code Editor"
            />
          </div>
    </div>
  );
};