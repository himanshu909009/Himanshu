import type { Theme, ThemeName } from './types';

export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    background: 'bg-gray-950',
    text: 'text-gray-200',
    lineNumber: 'text-gray-500',
    lineNumberBg: 'bg-gray-900',
    border: 'border-gray-700',
    caret: 'caret-gray-200',
  },
  light: {
    name: 'light',
    background: 'bg-white',
    text: 'text-gray-900',
    lineNumber: 'text-gray-500',
    lineNumberBg: 'bg-gray-100',
    border: 'border-gray-300',
    caret: 'caret-gray-900',
    lineNumberBorder: 'border-r border-gray-300',
  },
  solarized: {
    name: 'solarized',
    background: 'bg-[#002b36]',
    text: 'text-[#839496]',
    lineNumber: 'text-[#586e75]',
    lineNumberBg: 'bg-[#073642]',
    border: 'border-[#073642]',
    caret: 'caret-[#839496]',
  },
  monokai: {
    name: 'monokai',
    background: 'bg-[#272822]',
    text: 'text-[#F8F8F2]',
    lineNumber: 'text-[#75715E]',
    lineNumberBg: 'bg-[#3E3D32]',
    border: 'border-[#3E3D32]',
    caret: 'caret-[#F8F8F2]',
  },
};