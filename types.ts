// Fix: Populated the file with type definitions used across the application.
export type Language = 'c' | 'cpp' | 'java' | 'javascript' | 'python';

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
  line?: number;
  column?: number;
}

export interface TranscriptPart {
  type: 'stdout' | 'stdin' | 'stderr';
  content: string;
}

export interface ProgramOutput {
  stdout: string;
  stderr: string;
  transcript?: TranscriptPart[];
  timeUsage?: number;
  memoryUsage?: number;
  isExecutionFinished: boolean;
  files?: VirtualFile[];
}

export interface SimulationOutput {
  compilation: CompilationResult;
  execution: {
    stdin: string;
  };
  output: ProgramOutput;
}

export interface User {
  name: string;
  username: string;
  avatarUrl: string;
  email: string;
  college?: string;
  course?: string;
  stats: { label: string; value: number | string }[];
  submissions: RecentActivityItem[];
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
  cursorColor: string;
  lineNumberBorder?: string;
}

export interface Course {
  title: string;
  category: string;
  lessons: number;
  hours: number;
  level: string;
  color: string;
}

export interface PracticeProblem {
  name: string;
  description: string;
  problems: number;
  level: string;
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
  avatarUrl?: string;
}

export interface ContestProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

export interface RecentActivityItem {
  id: number;
  challengeId: number;
  title: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
  timestamp: string;
  code: string;
  language: Language;
}

export interface CourseLesson {
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'quiz' | 'practice';
}

export interface CourseModule {
    id: number;
    title: string;
    lessons: CourseLesson[];
}

export interface CourseDetails {
    title: string;
    description: string;
    icon: string;
    tags: {
        certification: boolean;
        rating: string;
    };
    stats: {
        lessons: number;
        hours: number;
        problems: number;
    };
    modules: CourseModule[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isLocked?: boolean;
}

export interface TestResult {
  testCase: TestCase;
  status: 'pass' | 'fail' | 'error';
  actualOutput: string;
  errorMessage?: string;
}

export interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  maxScore: number;
  successRate: string;
  description: string;
  isSolved: boolean;
  objective?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  boilerplateCode?: string;
  testCases?: TestCase[];
}

export interface Snippet {
  title: string;
  description: string;
  code: string;
}