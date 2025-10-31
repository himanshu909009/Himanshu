import React from 'react';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ value, onChange, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-[#2d3748] border border-slate-600 rounded-md overflow-hidden text-gray-200">
      <div className="flex justify-between items-center p-2 border-b border-slate-600 bg-slate-700">
        <h3 className="text-base font-medium text-gray-200 px-2">Standard Input (stdin)</h3>
      </div>
      <div className="flex-grow p-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="w-full h-full bg-transparent resize-none focus:outline-none p-3 font-mono text-base caret-gray-200"
          placeholder="Enter program input here. For interactive programs, you can also type in the output panel when prompted."
          spellCheck="false"
          aria-label="Standard Input"
        />
      </div>
    </div>
  );
};
