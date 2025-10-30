



import React, { useRef, useState } from 'react';
import type { Theme } from '../types';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme: Theme;
  errorLine: number | null;
  errorColumn: number | null;
  aiExplanation?: string | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, theme, errorLine, errorColumn, aiExplanation }) => {
  const lineNumbers = code.split('\n').map((_, index) => index + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!aiExplanation) return;
    const spanRect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.closest('.relative.flex-grow');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const top = spanRect.bottom - containerRect.top + 5; // Position below with 5px margin
      const left = spanRect.left - containerRect.left;
      setTooltipPosition({ top, left });
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
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
                if (errorColumn !== null && errorColumn > 0) {
                    const colIndex = Math.min(errorColumn - 1, line.length);

                    // If error is at EOL (e.g., missing ';'), highlight a space there.
                    if (colIndex === line.length) {
                        return <>{line}<span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="bg-red-500 bg-opacity-40 rounded-sm"> </span></>;
                    }
                    
                    let start = colIndex;
                    let end = colIndex;

                    // If the character at the error column is whitespace, just highlight that single character.
                    // Otherwise, expand to find the boundaries of the containing word/token.
                    if (!/\s/.test(line[start])) {
                        // Expand left
                        while (start > 0 && !/\s/.test(line[start - 1])) {
                            start--;
                        }
                        // Expand right
                        while (end < line.length - 1 && !/\s/.test(line[end + 1])) {
                            end++;
                        }
                    }

                    const before = line.substring(0, start);
                    const erroredPart = line.substring(start, end + 1);
                    const after = line.substring(end + 1);

                    return (
                        <>
                            {before}
                            <span 
                                className="bg-red-500 bg-opacity-20 rounded-sm underline decoration-wavy decoration-red-500"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {erroredPart}
                            </span>
                            {after}
                        </>
                    );
                }
                // Fallback to highlighting the whole line if no column info
                return <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="bg-red-500 bg-opacity-30">{line || ' '}</span>;
            })()}
            {lineIndex < lines.length - 1 ? '\n' : ''}
            {lines.slice(lineIndex + 1).join('\n')}
        </>
    );
  };
      
  const commonEditorClasses = "w-full h-full p-4 font-mono text-2xl resize-none focus:outline-none whitespace-pre-wrap break-words overflow-auto";

  return (
    <div className={`flex-grow flex ${theme.background} ${theme.border} border rounded-md overflow-hidden`}>
        <div
            ref={lineNumbersRef}
            className={`py-4 pl-2 pr-4 text-right ${theme.lineNumber} select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} font-mono text-2xl overflow-y-hidden`}
        >
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
            {isTooltipVisible && aiExplanation && (
                <div
                    className="absolute z-20 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-lg"
                    style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
                >
                    <h4 className={`font-bold text-lg mb-2 text-white`}>AI Assistant</h4>
                    <div 
                        className={`text-gray-300 text-base leading-relaxed max-w-none whitespace-pre-wrap`}
                        dangerouslySetInnerHTML={{ __html: aiExplanation.replace(/\`\`\`(\w+)?\n([\s\S]+?)\n\`\`\`/g, '<pre class="bg-gray-800 p-2 my-2 rounded-md font-mono text-sm block whitespace-pre overflow-x-auto"><code>$2</code></pre>') }}
                    />
                </div>
            )}
          </div>
    </div>
  );
};