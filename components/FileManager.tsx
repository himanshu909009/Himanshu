import React from 'react';
import type { VirtualFile } from '../types';

interface FileManagerProps {
  files: VirtualFile[];
  activeFileId: string;
  onFileSelect: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onAddFile,
  onDeleteFile,
}) => {
  return (
    <div className="bg-gray-800 rounded-md p-3 flex flex-col h-full border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Files</h3>
        <button
          onClick={onAddFile}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
          aria-label="Add new file"
          title="Add new file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex-grow space-y-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center justify-between group p-2 rounded-md cursor-pointer text-sm ${
              file.id === activeFileId
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onFileSelect(file.id)}
          >
            <span className="truncate">{file.name}</span>
            {files.length > 1 && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                }}
                className={`ml-2 p-1 rounded opacity-0 group-hover:opacity-100 ${
                    file.id === activeFileId ? 'hover:bg-blue-500' : 'hover:bg-gray-600'
                }`}
                aria-label={`Delete ${file.name}`}
                title={`Delete ${file.name}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};