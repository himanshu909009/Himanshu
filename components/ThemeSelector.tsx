import React from 'react';
import type { Theme, ThemeName } from '../types';

interface ThemeSelectorProps {
  themes: Record<ThemeName, Theme>;
  selectedTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm text-gray-400">Theme:</label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeName)}
        className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
        aria-label="Select Editor Theme"
      >
        {/* Fix: Explicitly type the 'theme' parameter to resolve 'unknown' type error. */}
        {Object.values(themes).map((theme: Theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};