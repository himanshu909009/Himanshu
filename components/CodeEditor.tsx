import React from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  return (
    <div className="flex-grow flex bg-gray-950 border border-gray-700 rounded-md overflow-hidden">
        <div className="p-4 text-right text-gray-500 select-none bg-gray-900">
            {lineNumbers.map(num => <div key={num}>{num}</div>)}
        </div>
        <textarea
            id="code-editor"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="flex-grow w-full bg-transparent text-gray-200 p-4 font-mono text-sm resize-none focus:outline-none"
            spellCheck="false"
            aria-label="Code Editor"
        />
    </div>
  );
};