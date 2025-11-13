import React, { useRef, useState, useEffect } from 'react';
// Fix: Add Language to imports
import type { Language, Theme, ThemeName } from '../types';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme: Theme;
  // Fix: Add language prop for syntax highlighting
  language: Language;
  errorLine: number | null;
  errorColumn: number | null;
  aiExplanation?: string | null;
  snippetToInsert?: { code: string; timestamp: number } | null;
}

declare var Prism: any;

const themeMap: Record<ThemeName, string> = {
  dark: 'dark',
  light: 'light',
  solarized: 'solarized',
  monokai: 'monokai',
};

// Fix: Destructure language from props
export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, theme, language, errorLine, errorColumn, aiExplanation, snippetToInsert }) => {
  const lineNumbers = code.split('\n').map((_, index) => index + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // State for character and line measurements
  const [charWidth, setCharWidth] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [padding, setPadding] = useState({ top: 16, left: 16 });

  useEffect(() => {
    if (snippetToInsert && textareaRef.current) {
      const { code: snippetCode } = snippetToInsert;
      const textarea = textareaRef.current;
      const currentValue = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newText = currentValue.substring(0, start) + snippetCode + currentValue.substring(end);
      onCodeChange(newText);
      
      setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPosition = start + snippetCode.length;
            textareaRef.current.selectionStart = newCursorPosition;
            textareaRef.current.selectionEnd = newCursorPosition;
            textareaRef.current.focus();
          }
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetToInsert]);

  // Effect to highlight code using Prism.js
  useEffect(() => {
    if (typeof Prism !== 'undefined' && preRef.current) {
        Prism.highlightAllUnder(preRef.current);
    }
  }, [code, theme]);
  
  // Effect to switch Prism theme stylesheet
  useEffect(() => {
      const targetThemeTitle = themeMap[theme.name];
      document.querySelectorAll('link[data-prism-theme]').forEach((link: any) => {
        link.disabled = link.title !== targetThemeTitle;
      });
  }, [theme]);

  // Effect to measure editor font metrics
  useEffect(() => {
    if (preRef.current) {
        // Use the inner code element for style measurement as it has the final padding.
        const codeEl = preRef.current.querySelector('code');
        if (!codeEl) return;

        const style = window.getComputedStyle(codeEl);
        const editorLineHeight = parseFloat(style.lineHeight);
        
        setPadding({
            top: parseFloat(style.paddingTop),
            left: parseFloat(style.paddingLeft),
        });

        // Create a temporary span to measure character width
        const tempSpan = document.createElement('span');
        // Apply relevant styles to get an accurate measurement
        tempSpan.className = 'font-mono text-base';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.textContent = 'X'; // Use a standard character for measurement
        document.body.appendChild(tempSpan);
        const rect = tempSpan.getBoundingClientRect();
        document.body.removeChild(tempSpan);

        setCharWidth(rect.width);
        setLineHeight(editorLineHeight);
    }
  }, [theme]); // Rerun if the theme changes, as font styles might differ

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

  const handleMouseEnterOnError = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!aiExplanation) return;
    const divRect = e.currentTarget.getBoundingClientRect();
    const editorContainer = e.currentTarget.closest('.relative.flex-grow');
    if (editorContainer) {
        const containerRect = editorContainer.getBoundingClientRect();
        setTooltipPosition({
            top: divRect.bottom - containerRect.top,
            left: divRect.left - containerRect.top,
        });
        setIsTooltipVisible(true);
    }
  };

  const handleMouseLeaveOnError = () => {
    setIsTooltipVisible(false);
  };
      
  // Fix: Removed `p-4` from common classes to fix cursor alignment issue.
  // Padding will be applied specifically where needed.
  const commonEditorClasses = "w-full h-full font-mono text-base resize-none focus:outline-none whitespace-pre-wrap leading-relaxed tracking-normal";

  return (
    <div className={`flex-grow flex ${theme.background} ${theme.border} border rounded-md overflow-hidden`}>
        <div
            ref={lineNumbersRef}
            data-name="line-number-gutter"
            className={`py-4 pl-2 pr-4 text-right ${theme.lineNumber} select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} font-mono text-base overflow-y-hidden leading-relaxed`}
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
              // Fix: No padding on the <pre> tag itself. Padding is handled by the <code> child via global CSS.
              className={`${commonEditorClasses} ${theme.text} absolute top-0 left-0 pointer-events-none overflow-hidden`}
            >
              <code className={`language-${language === 'cpp' ? 'cpp' : language}`}>
                {code + '\n'}
              </code>
            </pre>
            
            {errorLine && errorColumn && lineHeight > 0 && charWidth > 0 && (
                <div
                    className="absolute"
                    style={{
                        top: `${padding.top + (errorLine - 1) * lineHeight}px`,
                        left: `${padding.left + (errorColumn > 0 ? errorColumn - 1 : 0) * charWidth}px`,
                        width: `${charWidth}px`,
                        height: `${lineHeight}px`,
                        pointerEvents: 'auto',
                        cursor: 'help',
                    }}
                    onMouseEnter={handleMouseEnterOnError}
                    onMouseLeave={handleMouseLeaveOnError}
                >
                    <div
                        className="absolute bottom-0 w-full"
                        style={{
                            height: '2px',
                            backgroundColor: 'red',
                        }}
                    />
                </div>
            )}

            <textarea
              ref={textareaRef}
              id="code-editor"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onScroll={handleScroll}
              // Fix: Add `p-4` here to match the `<code>` element's padding, ensuring text alignment.
              className={`${commonEditorClasses} p-4 bg-transparent text-transparent ${theme.caret} relative z-10 overflow-auto`}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
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
