// Fix: Populated `types.ts` with all the necessary type definitions for the application.
export type Language = 'python' | 'javascript' | 'java' | 'cpp';

export interface LanguageOption {
  id: Language;
  name: string;
}

export interface CompilationResult {
  status: 'success' | 'error';
  message: string;
}

export interface ExecutionResult {
  stdin: string;
}

export interface ProgramOutput {
  stdout: string;
  stderr: string;
}

export interface SimulationOutput {
  compilation: CompilationResult;
  execution: ExecutionResult;
  output: ProgramOutput;
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
    level: 'Easy' | 'Medium' | 'Hard';
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
