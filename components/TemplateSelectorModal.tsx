import React from 'react';
import { CODE_TEMPLATES, CodeTemplate } from '../codeTemplates';
import type { Language } from '../types';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  language: Language;
}

const TemplateCard: React.FC<{ template: CodeTemplate; onSelect: (code: string) => void }> = ({ template, onSelect }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between hover:border-blue-500 transition-colors">
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{template.description}</p>
        </div>
        <button
            onClick={() => onSelect(template.code)}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
            Apply Template
        </button>
    </div>
);

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({ isOpen, onClose, onSelect, language }) => {
  if (!isOpen) return null;

  const templates = CODE_TEMPLATES[language] || [];

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Select a Code Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
                {templates.map(template => (
                    <TemplateCard key={template.name} template={template} onSelect={onSelect} />
                ))}
            </div>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-500">No templates available for this language.</p>
            </div>
        )}
      </div>
    </div>
  );
};
