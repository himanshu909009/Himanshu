
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
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
  storageKey?: string;
}

declare var Prism: any;

const themeMap: Record<ThemeName, string> = {
  dark: 'dark',
  light: 'light',
  solarized: 'solarized',
  monokai: 'monokai',
};

const sanitizeCode = (input: string): string => {
  // Removes non-printable control characters except for tab (\t), newline (\n), and carriage return (\r).
  const sanitized = input.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  // Normalize all line endings to LF (\n) for consistency.
  return sanitized.replace(/\r\n?/g, '\n');
};


// Helper hook to calculate foldable ranges for code blocks.
const useFoldableRanges = (code: string, language: Language) => {
    return useMemo(() => {
        const ranges = new Map<number, number>(); // Map from start line (1-based) to end line (1-based)
        const lines = code.split('\n');
        
        if (language === 'python') {
            const indentStack: { indent: number, line: number }[] = [];
            const effectiveLines: { indent: number, index: number, originalLine: string }[] = [];

            lines.forEach((line, i) => {
                const trimmedLine = line.trim();
                // Consider lines that are not empty or just comments
                if (trimmedLine.length > 0 && !trimmedLine.startsWith('#')) {
                    const indentMatch = line.match(/^\s*/);
                    effectiveLines.push({
                        indent: indentMatch ? indentMatch[0].length : 0,
                        index: i,
                        originalLine: line
                    });
                }
            });
            
            indentStack.push({ indent: -1, line: -1 }); // Base indent

            for (let i = 0; i < effectiveLines.length; i++) {
                const { indent: currentIndent, index: currentLineIndex, originalLine } = effectiveLines[i];
                let lastIndent = indentStack[indentStack.length - 1].indent;

                if (currentIndent > lastIndent) {
                    // A new, more indented block has started. The line before it is the start of the range.
                    if (i > 0) {
                       indentStack.push({ indent: currentIndent, line: effectiveLines[i - 1].index });
                    }
                }
                
                while (currentIndent < indentStack[indentStack.length - 1].indent) {
                     // The block has ended. Pop from stack and record the range.
                    const startBlock = indentStack.pop();
                    if (startBlock) {
                        const endLine = effectiveLines[i - 1].index;
                        if (endLine > startBlock.line) {
                           ranges.set(startBlock.line + 1, endLine + 1);
                        }
                    }
                }
            }
             while (indentStack.length > 1) { // Clear any remaining blocks
                const startBlock = indentStack.pop();
                if (startBlock && effectiveLines.length > 0) {
                   const endLine = effectiveLines[effectiveLines.length - 1].index;
                   if (endLine > startBlock.line) {
                       ranges.set(startBlock.line + 1, endLine + 1);
                   }
                }
            }
        } else { // Brace-based languages (C++, Java, JS, C)
            const stack: number[] = []; // Stack of starting line numbers for '{'
            let inMultiLineComment = false;
        
            lines.forEach((lineContent, i) => {
                const lineNum = i + 1;
                let inString: false | '"' | "'" = false;
                let inSingleLineComment = false;
    
                for (let j = 0; j < lineContent.length; j++) {
                    const char = lineContent[j];
                    const prevChar = j > 0 ? lineContent[j - 1] : null;
                    const nextChar = j < lineContent.length - 1 ? lineContent[j + 1] : null;
    
                    if (inMultiLineComment) {
                        if (char === '*' && nextChar === '/') {
                            inMultiLineComment = false;
                            j++;
                        }
                        continue;
                    }
                    if (inSingleLineComment) break;
                    
                    if (inString) {
                        if (char === inString && prevChar !== '\\') inString = false;
                        continue;
                    }
    
                    if (char === '/' && nextChar === '*') {
                        inMultiLineComment = true;
                        j++;
                        continue;
                    }
                    if (char === '/' && nextChar === '/') {
                        inSingleLineComment = true;
                        break;
                    }
                    if (char === '"' || char === "'") {
                        inString = char;
                        continue;
                    }
    
                    if (char === '{') {
                        stack.push(lineNum);
                    } else if (char === '}') {
                        if (stack.length > 0) {
                            const startLine = stack.pop()!;
                            if (startLine < lineNum) {
                                ranges.set(startLine, lineNum);
                            }
                        }
                    }
                }
            });
        }
        return ranges;
    }, [code, language]);
};


export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, theme, language, errorLine, errorColumn, aiExplanation, snippetToInsert, storageKey }) => {
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

  // Visual Cursor State
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [isFocused, setIsFocused] = useState(false);

  // This hook generates the code visible in the editor by replacing folded sections with placeholders.
  // It also creates mappings between original and visible line numbers for accurate editing and error highlighting.
  const { displayCode, displayLineNumbers, originalToDisplayMap, displayToOriginalMap } = useMemo(() => {
        const originalLines = code.split('\n');
        const displayLines: string[] = [];
        const lineNumbers: number[] = [];
        const otdMap: number[] = []; // Maps original line index to display line index
        const dtoMap: number[] = []; // Maps display line index to original line index

        let originalLineIndex = 0;
        while (originalLineIndex < originalLines.length) {
            const currentLineNum = originalLineIndex + 1;
            otdMap[originalLineIndex] = displayLines.length;
            dtoMap[displayLines.length] = originalLineIndex;
            
            const endFoldLineNum = foldableRanges.get(currentLineNum);
            
            if (foldedLines.has(currentLineNum) && endFoldLineNum) {
                 const lineContent = originalLines[originalLineIndex];
                 const indent = lineContent.match(/^\s*/)?.[0] || '';
                 displayLines.push(indent + (language === 'python' ? '...' : '{...}'));
                 lineNumbers.push(currentLineNum);
                 originalLineIndex = endFoldLineNum; // Jump to the line after the fold
            } else {
                 displayLines.push(originalLines[originalLineIndex]);
                 lineNumbers.push(currentLineNum);
                 originalLineIndex++;
            }
        }
        return {
            displayCode: displayLines.join('\n'),
            displayLineNumbers: lineNumbers,
            originalToDisplayMap: otdMap,
            displayToOriginalMap: dtoMap,
        };
    }, [code, foldedLines, foldableRanges, language]);

  useEffect(() => {
    if (snippetToInsert && textareaRef.current) {
      const { code: snippetCode } = snippetToInsert;
      const textarea = textareaRef.current;
      const currentValue = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newText = currentValue.substring(0, start) + snippetCode + currentValue.substring(end);
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
  }, [displayCode, theme, language]);
  
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

  useEffect(() => {
    if (storageKey) {
      const timer = setTimeout(() => {
        localStorage.setItem(storageKey, code);
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(timer);
    }
  }, [code, storageKey]);

  // This handler translates changes made in the folded 'display' view back to the original source code.
  const handleCodeChange = (newDisplayCode: string) => {
      const oldDisplayLines = displayCode.split('\n');
      const newDisplayLines = newDisplayCode.split('\n');
      
      let firstDiff = -1, lastDiffOld = -1, lastDiffNew = -1;
      const len = Math.max(oldDisplayLines.length, newDisplayLines.length);

      for (let i = 0; i < len; i++) {
        if (oldDisplayLines[i] !== newDisplayLines[i]) {
          if (firstDiff === -1) firstDiff = i;
          lastDiffOld = i;
          lastDiffNew = i;
        }
      }
      
      if (oldDisplayLines.length !== newDisplayLines.length) {
         lastDiffOld = Math.max(lastDiffOld, oldDisplayLines.length - 1);
         lastDiffNew = Math.max(lastDiffNew, newDisplayLines.length - 1);
      }
      
      if (firstDiff === -1) return; // No change detected

      const startOriginalLineIndex = displayToOriginalMap[firstDiff];
      if (startOriginalLineIndex === undefined) return;
      const endOriginalLineIndex = displayToOriginalMap[lastDiffOld] ?? startOriginalLineIndex;

      const replacementLines = newDisplayLines.slice(firstDiff, lastDiffNew + 1);
      const originalLines = code.split('\n');
      
      originalLines.splice(startOriginalLineIndex, endOriginalLineIndex - startOriginalLineIndex + 1, ...replacementLines);
      
      const newOriginalCode = originalLines.join('\n');
      const sanitizedCode = sanitizeCode(newOriginalCode);
      
      if (code !== sanitizedCode) {
          onCodeChange(sanitizedCode);
      }
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
            top: divRect.bottom - containerRect.top + 8, // Position below the error line
            left: divRect.left - containerRect.left
        });
        setIsTooltipVisible(true);
    }
  };

  const handleMouseLeaveOnError = () => {
    setIsTooltipVisible(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    updateCursorPosition();
    const textarea = e.currentTarget;

    if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        // Insert 4 spaces for a tab
        const newCode = displayCode.substring(0, start) + '    ' + displayCode.substring(end);
        handleCodeChange(newCode);
        
        // Move cursor after inserted tab
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        // Find the indentation of the current line
        const currentLineStart = displayCode.lastIndexOf('\n', start - 1) + 1;
        const currentLine = displayCode.substring(currentLineStart, start);
        const indentMatch = currentLine.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        
        // Insert newline and carry over indentation
        const newCode = displayCode.substring(0, start) + '\n' + indent + displayCode.substring(end);
        handleCodeChange(newCode);

        // Move cursor to the new line with indentation
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
        }, 0);
    }
  };
  
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current || charWidth === 0 || lineHeight === 0) return;

    const textarea = textareaRef.current;
    const textUpToCursor = displayCode.substring(0, textarea.selectionStart);
    const lines = textUpToCursor.split('\n');
    
    const currentLineNumber = lines.length - 1;
    const currentColumnNumber = lines[lines.length - 1].length;

    const top = currentLineNumber * lineHeight + padding.top - textarea.scrollTop;
    const left = currentColumnNumber * charWidth + padding.left - textarea.scrollLeft;
    
    setCursorPosition({ top, left });
  }, [charWidth, lineHeight, padding.top, padding.left, textareaRef, displayCode]);

  useEffect(() => {
    if (isFocused) {
      updateCursorPosition();
    }
  }, [code, isFocused, updateCursorPosition]);

  const handleFocus = () => {
    setIsFocused(true);
    updateCursorPosition();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const errorDisplayLine = errorLine !== null ? originalToDisplayMap[errorLine - 1] : null;
  
  return (
    <div className={`relative h-full font-mono text-base ${theme.background} ${theme.text} rounded-b-md border ${theme.border} border-t-0 overflow-hidden flex`}>
        <div 
          ref={lineNumbersRef}
          className={`flex-shrink-0 p-4 pt-[1rem] select-none ${theme.lineNumberBg} ${theme.lineNumberBorder || ''} overflow-hidden text-right`}
          style={{ lineHeight: `${lineHeight}px` }}
          aria-hidden="true"
        >
            {displayLineNumbers.map((lineNum, i) => {
                const isFoldStart = foldableRanges.has(lineNum);
                const isFolded = foldedLines.has(lineNum);
                const isError = errorDisplayLine === i;
                
                return (
                    <div key={i} className="relative h-[24px]">
                        <span className={`${theme.lineNumber} ${isError ? 'text-red-400 font-bold' : ''}`}>
                            {lineNum}
                        </span>
                        {isFoldStart && (
                             <button
                                onClick={() => toggleFold(lineNum)}
                                className={`absolute left-[-20px] top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-xs ${theme.lineNumber} hover:bg-gray-700/50 rounded-sm`}
                                title={isFolded ? 'Expand code' : 'Collapse code'}
                             >
                               {isFolded ? '▶' : '▼'}
                             </button>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="relative flex-grow h-full overflow-hidden">
            <textarea
              ref={textareaRef}
              value={displayCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              className={`absolute inset-0 z-0 resize-none overflow-auto bg-transparent p-4 font-mono text-base outline-none ${theme.text}`}
              style={{
                  textShadow: '0 0 0 rgba(0,0,0,0)',
                  color: 'transparent',
                  caretColor: 'transparent',
              }}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />

            <pre
              ref={preRef}
              className="absolute inset-0 z-1 pointer-events-none"
              aria-hidden="true"
            >
              <code className={`language-${language}`}>
                {displayCode}
              </code>
            </pre>
            
            {isFocused && (
                <div 
                    className="absolute z-2 pointer-events-none blinking-cursor"
                    style={{
                        top: cursorPosition.top,
                        left: cursorPosition.left,
                        width: '2px',
                        height: lineHeight,
                        backgroundColor: theme.cursorColor,
                    }}
                />
            )}
            
            {errorDisplayLine !== null && (
                 <div
                    className="absolute left-0 w-full bg-red-500/20 pointer-events-none"
                    style={{ top: `${errorDisplayLine * lineHeight + padding.top}px`, height: `${lineHeight}px` }}
                    onMouseEnter={handleMouseEnterOnError}
                    onMouseLeave={handleMouseLeaveOnError}
                >
                    {errorColumn !== null && charWidth > 0 && (
                        <div 
                            className="absolute h-full border-b-2 border-red-500"
                            style={{ 
                                left: `${(errorColumn - 1) * charWidth + padding.left}px`,
                                width: `${charWidth}px` 
                            }}
                        />
                    )}
                </div>
            )}
            
             {isTooltipVisible && aiExplanation && (
                <div
                    className="absolute z-30 p-2 bg-gray-800 border border-gray-600 rounded-md shadow-lg text-sm max-w-md"
                    style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                >
                    {aiExplanation.split('\n').slice(0, 2).join('\n')}...
                </div>
            )}
        </div>
    </div>
  );
};
