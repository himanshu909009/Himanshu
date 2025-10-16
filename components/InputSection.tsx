import React from 'react';

interface InputSectionProps {
  input: string;
  onInputChange: (input: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ input, onInputChange }) => {
  return (
    <div className="flex flex-col h-full">
      <textarea
        id="input-section"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        rows={5}
        className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-md p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Enter Input here"
        aria-label="Custom Input"
      />
      <p className="text-xs text-gray-500 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-md">
        If your code takes input, add it in the above box before running.
      </p>
    </div>
  );
};