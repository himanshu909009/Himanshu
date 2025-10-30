import React from 'react';
// Fix: Use 'import type' for type-only imports and combine them.
import type { Language, LanguageOption } from '../types';

interface LanguageSelectorProps {
  languages: LanguageOption[];
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <select
      id="language-select"
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
      aria-label="Select Language"
    >
      <option value="" disabled>Select Language</option>
      {languages.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};