import React, { useRef, useState, useEffect, useCallback } from 'react';
// Fix: Add Language to imports
import type { Language, Theme, ThemeName } from '../types';
// Fix: Import all suggestion sources
import { LANGUAGE_KEYWORDS, LANGUAGE_FUNCTIONS, CODE_SNIPPETS } from '../constants';

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
    while (startIndex > 0 && /[\w#.:]/.test(text[startIndex - 1])) {
        startIndex--;
    }
    const word = text.substring(startIndex, cursorPosition);
    return { word, start: startIndex };
};

// Fix: Add a structured type for suggestions to handle different kinds of completions.
interface Suggestion {
  label: string;
  type: 'keyword' | 'function' | 'snippet';
  insertText: string;
  description?: string;
}

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
        // Fix: Gather suggestions from multiple sources (keywords, functions, snippets).
        const keywordSuggestions: Suggestion[] = (LANGUAGE_KEYWORDS[language] || [])
            .filter(kw => kw.startsWith(word) && kw !== word)
            .map(kw => ({ label: kw, type: 'keyword', insertText: kw }));

        const functionSuggestions: Suggestion[] = (LANGUAGE_FUNCTIONS[language] || [])
            .filter(fn => fn.startsWith(word) && fn !== word)
            .map(fn => ({ label: fn, type: 'function', insertText: fn }));
        
        const snippetSuggestions: Suggestion[] = (CODE_SNIPPETS[language] || [])
            .filter(snip => snip.title.toLowerCase().startsWith(word.toLowerCase()))
            .map(snip => ({ 
                label: snip.title, 
                type: 'snippet', 
                insertText: snip.code,
                description: snip.description 
            }));
        
        const allSuggestions = [...snippetSuggestions, ...functionSuggestions, ...keywordSuggestions];
        const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
            index === self.findIndex((s) => s.label === suggestion.label)
        );


        if (uniqueSuggestions.length > 0) {
            const textUpToWordStart = value.substring(0, start);
            const lines = textUpToWordStart.split('\n');
            const lineNum = lines.length;
            const colNum = lines[lines.length - 1].length;
            
            const top = padding.top + (lineNum) * lineHeight - textarea.scrollTop;
            const left = padding.left + colNum * charWidth - textarea.scrollLeft;
            
            setSuggestionPosition({ top, left });
            setSuggestions(uniqueSuggestions);
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

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (!currentWord || !textareaRef.current) return;
    
    const { start, word } = currentWord;
    const textarea = textareaRef.current;
    const value = textarea.value;
    const endOfWord = start + word.length;
    
    // Fix: Handle insertion differently based on suggestion type.
    let textToInsert = suggestion.insertText;
    let cursorOffset = suggestion.insertText.length;

    if (suggestion.type !== 'snippet') {
        textToInsert += ' ';
        cursorOffset += 1;
    }
    
    const newText = value.substring(0, start) + textToInsert + value.substring(endOfWord);
    onCodeChange(newText);
    
    setTimeout(() => {
        if (textareaRef.current) {
            const newCursorPosition = start + cursorOffset;
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
    const BRACKET_PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };

    // --- Part 1: Suggestion Navigation (has highest priority) ---
    if (isSuggestionVisible && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
            return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            handleSuggestionSelect(suggestions[activeSuggestionIndex]);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setIsSuggestionVisible(false);
            return;
        }
    }

    // --- Part 2: Auto-editing Features ---
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // --- Auto-indentation on Enter ---
    if (e.key === 'Enter') {
        e.preventDefault();
        
        const lineStartPos = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLineText = value.substring(lineStartPos, selectionStart);
        const indentMatch = currentLineText.match(/^\s*/);
        const currentIndent = indentMatch ? indentMatch[0] : '';
        
        let newIndent = currentIndent;
        
        const trimmedLineBeforeCursor = currentLineText.trimEnd();
        let shouldIndent = false;

        if (language === 'python') {
            // In Python, any line ending with a colon starts an indented block.
            if (/:$/.test(trimmedLineBeforeCursor)) {
                shouldIndent = true;
            }
        } else { // C, C++, Java, JavaScript
            // Indent if the line ends with an opening brace.
            if (/{$/.test(trimmedLineBeforeCursor)) {
                shouldIndent = true;
            } else {
                // Also indent for control structures that don't have a brace yet on the same line.
                // This handles cases like `if (condition)` followed by Enter.
                // We avoid indenting if the line already ends in a semicolon.
                const controlStructureRegex = /^\s*((if|for|while)\s*\(.*\)|do|else(\s+if\s*\(.*\))?)\s*$/;
                if (controlStructureRegex.test(trimmedLineBeforeCursor) && !trimmedLineBeforeCursor.endsWith(';')) {
                    shouldIndent = true;
                }
            }
        }
        
        if (shouldIndent) {
            newIndent += '    ';
        }

        const charBeforeCursor = value[selectionStart - 1];
        const charAfterCursor = value[selectionStart];
        let textToInsert = '\n' + newIndent;

        if (BRACKET_PAIRS[charBeforeCursor] === charAfterCursor && charBeforeCursor !== '"' && charBeforeCursor !== "'") {
            textToInsert += '\n' + currentIndent;
        }
        
        const newText = value.substring(0, selectionStart) + textToInsert + value.substring(selectionEnd);
        onCodeChange(newText);
        
        setTimeout(() => {
            const cursorPosition = selectionStart + 1 + newIndent.length;
            textarea.selectionStart = cursorPosition;
            textarea.selectionEnd = cursorPosition;
        }, 0);
        return;
    }

    // --- Auto-closing Brackets/Quotes ---
    if (Object.keys(BRACKET_PAIRS).includes(e.key)) {
        e.preventDefault();
        const opening = e.key;
        const closing = BRACKET_PAIRS[opening];
        const selectedText = value.substring(selectionStart, selectionEnd);
        
        const newText = 
            value.substring(0, selectionStart) +
            opening +
            selectedText +
            closing +
            value.substring(selectionEnd);
            
        onCodeChange(newText);
        
        setTimeout(() => {
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1 + selectedText.length;
        }, 0);
        return;
    }

    // --- Skip-over closing brackets/quotes ---
    const closingChars = ['}', ')', ']', '"', "'", '`'];
    if (closingChars.includes(e.key) && selectionStart === selectionEnd && value[selectionStart] === e.key) {
        e.preventDefault();
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1;
        return;
    }
    
    // --- Backspace to remove pairs ---
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
        const charBefore = value[selectionStart - 1];
        const charAfter = value[selectionStart];
        if (BRACKET_PAIRS[charBefore] === charAfter) {
            e.preventDefault();
            const newText = value.substring(0, selectionStart - 1) + value.substring(selectionStart + 1);
            onCodeChange(newText);

            setTimeout(() => {
                textarea.selectionStart = selectionStart - 1;
                textarea.selectionEnd = selectionStart - 1;
            }, 0);
            return;
        }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        updateSuggestions();
    }, 150); // Debounce
    return () => clearTimeout(timer);
  }, [code, updateSuggestions]);
      
  const commonEditorClasses = "w-full h-full font-mono text-base resize-none focus:outline-none whitespace-pre-wrap tracking-normal";

  return (
    <div className={`h-full flex ${theme.background} ${theme.border} border rounded-md overflow-hidden`}>
        <div
            ref={lineNumbersRef}
            data-name="line-number-gutter"
            className={`text-right ${theme.lineNumber} select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} font-mono text-base overflow-hidden leading-relaxed`}
        >
            <div className="py-4 pl-2 pr-4">
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
        </div>
        <div className="relative flex-grow h-full">
            <pre
              ref={preRef}
              aria-hidden="true"
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
              className={`${commonEditorClasses} p-4 bg-transparent text-transparent ${theme.caret} relative z-10 overflow-auto leading-relaxed`}
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
                        {/* Fix: Updated rendering to show suggestion type and description. */}
                        {suggestions.map((suggestion, index) => (
                             <li
                                key={`${suggestion.label}-${suggestion.type}`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSuggestionSelect(suggestion)}
                                className={`px-3 py-2 text-base text-gray-200 cursor-pointer flex justify-between items-center ${
                                    index === activeSuggestionIndex ? 'bg-blue-600' : 'hover:bg-gray-700'
                                }`}
                                role="option"
                                aria-selected={index === activeSuggestionIndex}
                            >
                                <div className="flex-grow pr-2">
                                    <div className="font-medium text-white">{suggestion.label}</div>
                                    {suggestion.description && <div className="text-xs text-gray-400 mt-0.5 truncate">{suggestion.description}</div>}
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-800 flex-shrink-0 ml-4 px-1.5 py-0.5 rounded-sm capitalize">
                                    {suggestion.type}
                                </span>
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