import React, { useRef, useState, useEffect, useCallback } from 'react';
// Fix: Add Language to imports
import type { Language, Theme, ThemeName } from '../types';
import { LANGUAGE_KEYWORDS } from '../constants';

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

const getCurrentWordInfo = (text: string, cursorPosition: number) => {
    let startIndex = cursorPosition;
    // Handles keywords that start with '#' like #include
    if (startIndex > 0 && text[startIndex - 1] === '#') {
        startIndex--;
    }
    while (startIndex > 0 && /[\w#]/.test(text[startIndex - 1])) {
        startIndex--;
    }
    const word = text.substring(startIndex, cursorPosition);
    return { word, start: startIndex };
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

  // Autosuggestion state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<{ word: string; start: number } | null>(null);
  
  const updateSuggestions = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !charWidth || !lineHeight) {
        setIsSuggestionVisible(false);
        return;
    }

    const { value, selectionStart } = textarea;
    if (selectionStart !== textarea.selectionEnd) {
        setIsSuggestionVisible(false);
        return;
    }
    
    const { word, start } = getCurrentWordInfo(value, selectionStart);

    if (word.length > 0) {
        const allKeywords = LANGUAGE_KEYWORDS[language] || [];
        const filteredSuggestions = allKeywords.filter(kw => kw.startsWith(word) && kw !== word);

        if (filteredSuggestions.length > 0) {
            const textUpToWordStart = value.substring(0, start);
            const lines = textUpToWordStart.split('\n');
            const lineNum = lines.length;
            const colNum = lines[lines.length - 1].length;
            
            const top = padding.top + (lineNum) * lineHeight - textarea.scrollTop;
            const left = padding.left + colNum * charWidth - textarea.scrollLeft;
            
            setSuggestionPosition({ top, left });
            setSuggestions(filteredSuggestions);
            setIsSuggestionVisible(true);
            setActiveSuggestionIndex(0);
            setCurrentWord({ word, start });
        } else {
            setIsSuggestionVisible(false);
        }
    } else {
        setIsSuggestionVisible(false);
    }
  }, [language, charWidth, lineHeight, padding.top, padding.left]);

  const handleSuggestionSelect = (suggestion: string) => {
    if (!currentWord || !textareaRef.current) return;
    
    const { start, word } = currentWord;
    const textarea = textareaRef.current;
    const value = textarea.value;

    const endOfWord = start + word.length;
    
    const newText = value.substring(0, start) + suggestion + ' ' + value.substring(endOfWord);
    onCodeChange(newText);
    
    setTimeout(() => {
        if (textareaRef.current) {
            const newCursorPosition = start + suggestion.length + 1;
            textareaRef.current.focus();
            textareaRef.current.selectionStart = newCursorPosition;
            textareaRef.current.selectionEnd = newCursorPosition;
        }
    }, 0);

    setIsSuggestionVisible(false);
  };
  
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
    if (isSuggestionVisible) {
        updateSuggestions();
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSuggestionVisible && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            handleSuggestionSelect(suggestions[activeSuggestionIndex]);
        } else if (e.key === 'Escape') {
            setIsSuggestionVisible(false);
        }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        updateSuggestions();
    }, 150); // Debounce
    return () => clearTimeout(timer);
  }, [code, updateSuggestions]);
      
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
              onKeyUp={(e) => ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && updateSuggestions()}
              onClick={updateSuggestions}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsSuggestionVisible(false)}
              // Fix: Add `p-4` here to match the `<code>` element's padding, ensuring text alignment.
              className={`${commonEditorClasses} p-4 bg-transparent text-transparent ${theme.caret} relative z-10 overflow-auto`}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Code Editor"
            />
            {isSuggestionVisible && (
                <div
                    className="absolute z-30 bg-gray-900 border border-gray-700 rounded-md shadow-lg"
                    style={{ top: `${suggestionPosition.top}px`, left: `${suggestionPosition.left}px` }}
                >
                    <ul className="py-1 max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSuggestionSelect(suggestion)}
                                className={`px-4 py-1.5 text-base text-gray-200 cursor-pointer ${
                                    index === activeSuggestionIndex ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                                role="option"
                                aria-selected={index === activeSuggestionIndex}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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