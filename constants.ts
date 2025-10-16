// Fix: Populated `constants.ts` with constant data used throughout the application.
import type { Language, LanguageOption, Course, PracticeProblem, Contest, PastContest, LeaderboardUser, ContestProblem } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
];

export const DEFAULT_CODE: Record<Language, string> = {
  python: 'def main():\n    # Your code here\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
  javascript: 'function main() {\n    // Your code here\n    console.log("Hello, World!");\n}\n\nmain();',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    // Your code here\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, World!\\n");\n    return 0;\n}',
};

export const COURSES: Course[] = [
    { title: 'Data Structures & Algorithms', category: 'Programming', lessons: 45, hours: 45, level: 'Intermediate', color: 'bg-blue-500' },
    { title: 'Object Oriented Programming using C++', category: 'Programming', lessons: 45, hours: 45, level: 'Beginner', color: 'bg-green-500' },
    { title: 'Data Structure using C', category: 'Programming', lessons: 45, hours: 45, level: 'Advanced', color: 'bg-purple-500' },
];

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
    { name: 'Python', description: 'Master Python with our curated problems.', problems: 120, level: 'Easy', icon: '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg>', color: 'bg-blue-600' },
    { name: 'JavaScript', description: 'Sharpen your JS skills for web dev.', problems: 90, level: 'Medium', icon: '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg>', color: 'bg-yellow-500' },
    { name: 'Java', description: 'Solve problems with robust, object-oriented code.', problems: 150, level: 'Medium', icon: '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg>', color: 'bg-red-500' },
    { name: 'C++', description: 'Tackle complex problems with high performance.', problems: 180, level: 'Hard', icon: '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg>', color: 'bg-gray-600' },
    { name: 'C', description: 'Learn the fundamentals of systems programming.', problems: 160, level: 'Hard', icon: '<svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg>', color: 'bg-indigo-600' },
];

export const CONTESTS: Contest[] = [
    { title: 'Weekly Contest #345', startTime: 'Starts in 2d 5h', duration: '90 mins', participants: 1204 },
    { title: 'Biweekly Contest #112', startTime: 'Starts in 9d 3h', duration: '90 mins', participants: 876 },
];

export const PAST_CONTESTS: PastContest[] = [
    { name: 'Weekly Contest #344', date: 'Jul 15, 2024' },
    { name: 'Weekly Contest #343', date: 'Jul 08, 2024' },
    { name: 'Biweekly Contest #111', date: 'Jul 01, 2024' },
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
    { rank: 1, name: 'Alex', score: 2450 },
    { rank: 2, name: 'Ben', score: 2390 },
    { rank: 3, name: 'Chris', score: 2310 },
    { rank: 4, name: 'David', score: 2250 },
    { rank: 5, name: 'Eva', score: 2200 },
];

export const CONTEST_PROBLEMS: ContestProblem[] = [
    { id: 'A', title: 'Two Sum Variant', difficulty: 'Easy', points: 300 },
    { id: 'B', title: 'Maximum Subarray Sum', difficulty: 'Medium', points: 500 },
    { id: 'C', title: 'Longest Palindromic Substring', difficulty: 'Medium', points: 700 },
    { id: 'D', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', points: 1000 },
];