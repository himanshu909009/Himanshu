import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { getAiCodeCompletion } from '../services/geminiService';
import type { Language, Theme, ThemeName } from '../types';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  theme: Theme;
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

// Simple debounce utility
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: Parameters<F>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => void;
}


// Helper hook to calculate foldable ranges
const useFoldableRanges = (code: string, language: Language) => {
    return useMemo(() => {
        const ranges = new Map<number, number>();
        const lines = code.split('\n');
        const stack: { char: string; line: number }[] = [];
        const indentStack: { indent: number; line: number }[] = [];

        if (language === 'python') {
            let lastIndent = -1;
            const effectiveLines: {indent: number, index: number}[] = [];

            lines.forEach((line, i) => {
                if (line.trim().length > 0) {
                    const indentMatch = line.match(/^\s*/);
                    const currentIndent = indentMatch ? indentMatch[0].length : 0;
                    effectiveLines.push({ indent: currentIndent, index: i });
                }
            });

            effectiveLines.forEach(({ indent, index }, i) => {
                if (indent > lastIndent) {
                    indentStack.push({ indent: lastIndent, line: index });
                } else if (indent < lastIndent) {
                     while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1].indent) {
                        const start = indentStack.pop();
                        if (start) {
                            let endLine = -1;
                            for (let j = i; j < effectiveLines.length; j++) {
                                if (effectiveLines[j].indent <= start.indent) {
                                    endLine = effectiveLines[j-1].index;
                                    break;
                                }
                            }
                            if (endLine === -1) {
                                endLine = effectiveLines[effectiveLines.length - 1].index;
                            }
                            if (endLine > start.line) {
                                ranges.set(start.line + 1, endLine + 1);
                            }
                        }
                    }
                }
                lastIndent = indent;
            });
             while (indentStack.length > 0) {
                 const start = indentStack.pop();
                 if (start) {
                    const endLine = effectiveLines[effectiveLines.length - 1].index;
                    if (endLine > start.line) {
                        ranges.set(start.line + 1, endLine + 1);
                    }
                 }
            }


        } else { // Brace-based languages
            lines.forEach((line, i) => {
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === '{') {
                        stack.push({ char: '{', line: i + 1 });
                    } else if (line[j] === '}') {
                        if (stack.length > 0 && stack[stack.length - 1].char === '{') {
                            const start = stack.pop();
                            if (start && start.line < i + 1) {
                                ranges.set(start.line, i + 1);
                            }
                        }
                    }
                }
            });
        }
        return ranges;
    }, [code, language]);
};


export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, theme, language, errorLine, errorColumn, aiExplanation, snippetToInsert }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const [charWidth, setCharWidth] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [padding, setPadding] = useState({ top: 16, left: 16 });
  
  // Code Folding State
  const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set());
  const foldableRanges = useFoldableRanges(code, language);

  // AI Code Completion State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

  const { displayCode, displayLineNumbers, originalToDisplayMap, displayToOriginalMap } = useMemo(() => {
        const originalLines = code.split('\n');
        const displayLines: string[] = [];
        const lineNumbers: (number | string)[] = [];
        const otdMap: number[] = [];
        const dtoMap: number[] = [];

        let currentLine = 1;
        while (currentLine <= originalLines.length) {
            otdMap[currentLine - 1] = displayLines.length;
            
            const isFolded = foldedLines.has(currentLine);
            const endLine = foldableRanges.get(currentLine);
            
            if (isFolded && endLine) {
                 dtoMap[displayLines.length] = currentLine - 1;
                 const lineContent = originalLines[currentLine - 1];
                 const indent = lineContent.match(/^\s*/)?.[0] || '';
                 displayLines.push(indent + '{...}');
                 lineNumbers.push(currentLine);
                 currentLine = endLine + 1;
            } else {
                 dtoMap[displayLines.length] = currentLine - 1;
                 displayLines.push(originalLines[currentLine - 1]);
                 lineNumbers.push(currentLine);
                 currentLine++;
            }
        }
        return {
            displayCode: displayLines.join('\n'),
            displayLineNumbers: lineNumbers,
            originalToDisplayMap: otdMap,
            displayToOriginalMap: dtoMap,
        };
    }, [code, foldedLines, foldableRanges]);

  useEffect(() => {
    if (snippetToInsert && textareaRef.current) {
      const { code: snippetCode } = snippetToInsert;
      const textarea = textareaRef.current;
      const currentValue = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newText = currentValue.substring(0, start) + snippetCode + currentValue.substring(end);
      // Since the textarea is now controlled by displayCode, we need to handle the update carefully
      // This simple insertion might not work correctly with folding. For now, we assume it does.
      handleCodeChange(newText);
      
      setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPosition = start + snippetCode.length;
            textareaRef.current.selectionStart = newCursorPosition;
            textareaRef.current.selectionEnd = newCursorPosition;
            textareaRef.current.focus();
          }
      }, 0);
    }
  }, [snippetToInsert]);

  useEffect(() => {
    if (typeof Prism !== 'undefined' && preRef.current) {
        Prism.highlightAllUnder(preRef.current);
    }
  }, [displayCode, theme]);
  
  useEffect(() => {
      const targetThemeTitle = themeMap[theme.name];
      document.querySelectorAll('link[data-prism-theme]').forEach((link: any) => {
        link.disabled = link.title !== targetThemeTitle;
      });
  }, [theme]);

  useEffect(() => {
    if (preRef.current) {
        const codeEl = preRef.current.querySelector('code');
        if (!codeEl) return;

        const style = window.getComputedStyle(codeEl);
        const editorLineHeight = parseFloat(style.lineHeight);
        
        setPadding({
            top: parseFloat(style.paddingTop),
            left: parseFloat(style.paddingLeft),
        });

        const tempSpan = document.createElement('span');
        tempSpan.className = 'font-mono text-base';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.textContent = 'X';
        document.body.appendChild(tempSpan);
        const rect = tempSpan.getBoundingClientRect();
        document.body.removeChild(tempSpan);

        setCharWidth(rect.width);
        setLineHeight(editorLineHeight);
    }
  }, [theme]);

  const handleCodeChange = (newDisplayCode: string) => {
      setIsSuggestionsVisible(false);
      const oldDisplayLines = displayCode.split('\n');
      const newDisplayLines = newDisplayCode.split('\n');

      let firstDiff = -1;
      let lastDiffOld = -1;
      let lastDiffNew = -1;

      const len = Math.max(oldDisplayLines.length, newDisplayLines.length);
      for (let i = 0; i < len; i++) {
        if (oldDisplayLines[i] !== newDisplayLines[i]) {
          if (firstDiff === -1) firstDiff = i;
          lastDiffOld = i;
          lastDiffNew = i;
        }
      }
      
      if (oldDisplayLines.length !== newDisplayLines.length) {
         lastDiffOld = oldDisplayLines.length - 1;
         lastDiffNew = newDisplayLines.length - 1;
      }

      if (firstDiff === -1) return; // No change

      const startOriginalLine = displayToOriginalMap[firstDiff];
      if (startOriginalLine === undefined) return;

      const endOriginalLine = displayToOriginalMap[lastDiffOld] ?? startOriginalLine;
      const originalLines = code.split('\n');
      const replacementLines = newDisplayLines.slice(firstDiff, lastDiffNew + 1);

      originalLines.splice(startOriginalLine, endOriginalLine - startOriginalLine + 1, ...replacementLines);
      
      onCodeChange(originalLines.join('\n'));
  };

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
  
   const handleAcceptSuggestion = (suggestion: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText = displayCode.substring(0, start) + suggestion + displayCode.substring(end);
    handleCodeChange(newText);
    
    setIsSuggestionsVisible(false);

    setTimeout(() => {
        if (textareaRef.current) {
            const newCursorPos = start + suggestion.length;
            textareaRef.current.selectionStart = newCursorPos;
            textareaRef.current.selectionEnd = newCursorPos;
            textareaRef.current.focus();
        }
    }, 0);
  };

  const fetchSuggestions = useCallback(async (currentCode: string, position: number) => {
      const charBefore = currentCode[position - 1];
      const lineBeforeCursor = currentCode.substring(0, position).substring(currentCode.lastIndexOf('\n', position -1) + 1);
      
      if (!charBefore || (lineBeforeCursor.trim() === '' && !charBefore.match(/[.({[]/))) {
          setIsSuggestionsVisible(false);
          return;
      }
      
      try {
          const result = await getAiCodeCompletion(language, currentCode, position);
          if (result && result.length > 0) {
              setSuggestions(result);
              setActiveSuggestionIndex(0);

              const textarea = textareaRef.current;
              if (textarea) {
                  const lines = currentCode.substring(0, position).split('\n');
                  const lineIndex = lines.length - 1;
                  const colIndex = lines[lineIndex].length;

                  const top = padding.top + (lineIndex * lineHeight) + lineHeight;
                  const left = padding.left + colIndex * charWidth;
                  
                  setSuggestionPosition({ top, left });
                  setIsSuggestionsVisible(true);
              }
          } else {
              setIsSuggestionsVisible(false);
          }
      } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setIsSuggestionsVisible(false);
      }
  }, [language, charWidth, lineHeight, padding]);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), [fetchSuggestions]);

  const handleCursorActivity = () => {
    if (textareaRef.current) {
        const position = textareaRef.current.selectionStart;
        if (textareaRef.current.selectionStart !== textareaRef.current.selectionEnd) {
             setIsSuggestionsVisible(false);
             return;
        }
        debouncedFetchSuggestions(displayCode, position);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSuggestionsVisible) {
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
            handleAcceptSuggestion(suggestions[activeSuggestionIndex]);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setIsSuggestionsVisible(false);
            return;
        }
    }
    const BRACKET_PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

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
            if (/:$/.test(trimmedLineBeforeCursor)) shouldIndent = true;
        } else {
            if (/{$/.test(trimmedLineBeforeCursor)) {
                shouldIndent = true;
            } else {
                const controlStructureRegex = /^\s*((if|for|while)\s*\(.*\)|do|else(\s+if\s*\(.*\))?)\s*$/;
                if (controlStructureRegex.test(trimmedLineBeforeCursor) && !trimmedLineBeforeCursor.endsWith(';')) {
                    shouldIndent = true;
                }
            }
        }
        
        // Handle hanging indents from open parens/brackets
        const openParenCount = (trimmedLineBeforeCursor.match(/\(/g) || []).length;
        const closeParenCount = (trimmedLineBeforeCursor.match(/\)/g) || []).length;
        if (openParenCount > closeParenCount) {
             shouldIndent = true;
        }
        const openBracketCount = (trimmedLineBeforeCursor.match(/\[/g) || []).length;
        const closeBracketCount = (trimmedLineBeforeCursor.match(/\]/g) || []).length;
         if (openBracketCount > closeBracketCount) {
             shouldIndent = true;
        }


        if (shouldIndent) newIndent += '    ';

        const charBeforeCursor = value[selectionStart - 1];
        const charAfterCursor = value[selectionStart];
        let textToInsert = '\n' + newIndent;

        if ((charBeforeCursor === '{' && charAfterCursor === '}') ||
            (charBeforeCursor === '[' && charAfterCursor === ']') ||
            (charBeforeCursor === '(' && charAfterCursor === ')')) {
            textToInsert += '\n' + currentIndent;
        }
        
        const newText = value.substring(0, selectionStart) + textToInsert + value.substring(selectionEnd);
        handleCodeChange(newText);
        
        setTimeout(() => {
            const cursorPosition = selectionStart + 1 + newIndent.length;
            textarea.selectionStart = cursorPosition;
            textarea.selectionEnd = cursorPosition;
        }, 0);
        return;
    }

    if (Object.keys(BRACKET_PAIRS).includes(e.key)) {
        e.preventDefault();
        const opening = e.key;
        const closing = BRACKET_PAIRS[opening];
        const selectedText = value.substring(selectionStart, selectionEnd);
        const newText = value.substring(0, selectionStart) + opening + selectedText + closing + value.substring(selectionEnd);
        handleCodeChange(newText);
        setTimeout(() => {
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1 + selectedText.length;
        }, 0);
        return;
    }

    const closingChars = ['}', ')', ']', '"', "'", '`'];
    if (closingChars.includes(e.key) && selectionStart === selectionEnd) {
        if (value[selectionStart] === e.key) {
            e.preventDefault();
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1;
            return;
        }
        
        if (e.key === '}' || e.key === ')' || e.key === ']') {
            const lineStartPos = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const currentLineText = value.substring(lineStartPos, selectionStart);
            
            if (currentLineText.trim() === '' && currentLineText.length >= 4) {
                e.preventDefault();
                const newIndent = currentLineText.substring(0, currentLineText.length - 4);
                const newText = value.substring(0, lineStartPos) + newIndent + e.key + value.substring(selectionEnd);
                handleCodeChange(newText);

                setTimeout(() => {
                    const cursorPosition = lineStartPos + newIndent.length + 1;
                    textarea.selectionStart = cursorPosition;
                    textarea.selectionEnd = cursorPosition;
                }, 0);
                return;
            }
        }
    }
    
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
        const charBefore = value[selectionStart - 1];
        const charAfter = value[selectionStart];
        if (BRACKET_PAIRS[charBefore] === charAfter) {
            e.preventDefault();
            const newText = value.substring(0, selectionStart - 1) + value.substring(selectionStart + 1);
            handleCodeChange(newText);
            setTimeout(() => {
                textarea.selectionStart = selectionStart - 1;
                textarea.selectionEnd = selectionStart - 1;
            }, 0);
            return;
        }
    }
  };

  const toggleFold = (startLine: number) => {
    setFoldedLines(prev => {
        const newSet = new Set(prev);
        if (newSet.has(startLine)) {
            newSet.delete(startLine);
        } else {
            newSet.add(startLine);
        }
        return newSet;
    });
  };
      
  const commonEditorClasses = "w-full h-full font-mono text-base resize-none focus:outline-none whitespace-pre-wrap tracking-normal";
  const displayErrorLine = errorLine !== null ? originalToDisplayMap[errorLine - 1] + 1 : null;

  return (
    <div className={`h-full flex ${theme.background} ${theme.border} border rounded-md overflow-hidden`}>
        <div
            ref={lineNumbersRef}
            data-name="line-number-gutter"
            className={`text-right ${theme.lineNumber} select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} font-mono text-base overflow-hidden`}
            style={{lineHeight: '1.5rem'}}
        >
            <div className="py-4 pl-2 pr-4 h-full">
                {displayLineNumbers.map((num, index) => {
                    const originalLineNumber = typeof num === 'number' ? num : parseInt(num.toString(), 10);
                    const isFoldable = foldableRanges.has(originalLineNumber);
                    const isFolded = foldedLines.has(originalLineNumber);

                    return (
                        <div 
                            key={index} 
                            className={`px-2 rounded-l-sm transition-colors duration-200 flex items-center justify-end h-6`}
                        >
                            {isFoldable ? (
                                <button onClick={() => toggleFold(originalLineNumber)} className="mr-1 text-gray-500 hover:text-white">
                                    {isFolded ? '▶' : '▼'}
                                </button>
                            ) : (
                                <span className="w-4 mr-1"></span>
                            )}
                            <span className={num === displayErrorLine ? 'bg-red-500 bg-opacity-30 text-white' : ''}>
                                {isFolded ? '...' : num}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="relative flex-grow h-full">
            <pre
              ref={preRef}
              aria-hidden="true"
              className={`${commonEditorClasses} ${theme.text} absolute top-0 left-0 pointer-events-none overflow-hidden`}
            >
              <code className={`language-${language === 'cpp' ? 'cpp' : language}`}>
                {displayCode + '\n'}
              </code>
            </pre>
            
            {displayErrorLine && errorColumn && lineHeight > 0 && charWidth > 0 && (
                <div
                    className="absolute"
                    style={{
                        top: `${padding.top + (displayErrorLine - 1) * lineHeight}px`,
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
              value={displayCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              onKeyUp={handleCursorActivity}
              onSelect={handleCursorActivity}
              onClick={handleCursorActivity}
              className={`${commonEditorClasses} p-4 bg-transparent text-transparent ${theme.caret} relative z-10 overflow-auto`}
              style={{lineHeight: '1.5rem'}}
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
             {isSuggestionsVisible && (
                <div
                    className="absolute z-30 bg-gray-800 border border-gray-700 rounded-md shadow-lg min-w-[200px]"
                    style={{ top: `${suggestionPosition.top}px`, left: `${suggestionPosition.left}px` }}
                >
                    <ul className="py-1">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={`px-3 py-1 text-sm font-mono cursor-pointer ${
                                    index === activeSuggestionIndex
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                }`}
                                onClick={() => handleAcceptSuggestion(suggestion)}
                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
    </div>
  );
};