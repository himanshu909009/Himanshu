// Fix: Added definitions for all required types.
export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'c';

export interface LanguageOption {
  id: Language;
  name: string;
}

export interface VirtualFile {
  id: string;
  name: string;
  content: string;
}

export interface CompilationResult {
  status: 'success' | 'error';
  message: string;
  line?: number | null;
  column?: number | null;
}

export interface ExecutionResult {
  stdin: string;
}

export type TranscriptPart = {
  type: 'stdout' | 'stdin' | 'stderr';
  content: string;
};

export interface OutputResult {
  stdout: string;
  stderr: string;
  transcript?: TranscriptPart[];
  timeUsage?: number;
  memoryUsage?: number;
  files?: VirtualFile[];
  isExecutionFinished?: boolean;
}

export interface SimulationOutput {
  compilation: CompilationResult;
  execution: ExecutionResult;
  output: OutputResult;
}

export type ThemeName = 'dark' | 'light' | 'solarized' | 'monokai';

export interface Theme {
  name: ThemeName;
  background: string;
  text: string;
  lineNumber: string;
  lineNumberBg: string;
  border: string;
  caret: string;
  lineNumberBorder?: string;
}

export interface Course {
  title: string;
  category: string;
  lessons: number;
  hours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
}

export interface PracticeProblem {
    name: string;
    description: string;
    problems: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    icon: string;
    color: string;
}

export interface Contest {
    title: string;
    startTime: string;
    duration: string;
    participants: number;
}

export interface PastContest {
    name: string;
    date: string;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    score: number;
}

export interface ContestProblem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
}

export interface RecentActivityItem {
    id: number;
    title: string;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
    timestamp: string;
}