// Fix: Added mock data for constants used throughout the application.
import type { Language, LanguageOption, Course, PracticeProblem, Contest, PastContest, LeaderboardUser, ContestProblem, RecentActivityItem } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
];

export const DEFAULT_CODE: Record<Language, string> = {
  python: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
  javascript: 'console.log("Hello, World!");',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h> // Includes the standard Input/output library\n\nint main() {\n    // Declare integer variables to store the two numbers and their sum\n    int num1, num2, sum;\n\n    // Prompt the user to enter the first number\n    printf("Enter the first integer: ");\n\n    // Read the first integer from the user and store it in num1\n    scanf("%d", &num1);\n\n    // Prompt the user to enter the second integer\n    printf("Enter the second integer: ");\n\n    // Read the second integer from the user and store it in num2\n    scanf("%d", &num2);\n\n    // Calculate the sum of the two numbers\n    sum = num1 + num2;\n\n    // Print the result to the console\n    printf("The sum of %d and %d is: %d\\n", num1, num2, sum);\n\n    // Indicate successful program execution\n    return 0;\n}',
};

export const COURSES: Course[] = [
    { title: 'Data Structures & Algorithms', category: 'Computer Science', lessons: 24, hours: 12, level: 'Intermediate', color: 'bg-blue-500' },
    { title: 'Introduction to Python', category: 'Programming', lessons: 18, hours: 8, level: 'Beginner', color: 'bg-yellow-500' },
    { title: 'Object Oriented Programming', category: 'Programming', lessons: 30, hours: 20, level: 'Intermediate', color: 'bg-green-500' },
    { title: 'Problem Solving using C', category: 'Programming', lessons: 25, hours: 15, level: 'Beginner', color: 'bg-indigo-500' },
    { title: 'Computer Organization & Architecture', category: 'Computer Science', lessons: 35, hours: 25, level: 'Advanced', color: 'bg-purple-500' },
];

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    name: 'Python',
    description: 'Master Python with our curated list of problems.',
    problems: 150,
    level: 'Beginner',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
    color: 'bg-yellow-600',
  },
  {
    name: 'Java',
    description: 'Solve problems and build your skills in Java.',
    problems: 200,
    level: 'Intermediate',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>',
    color: 'bg-red-600',
  },
  {
    name: 'C++',
    description: 'Challenge yourself with complex C++ problems.',
    problems: 250,
    level: 'Advanced',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /></svg>',
    color: 'bg-blue-600',
  },
  {
    name: 'JavaScript',
    description: 'Explore web-related challenges with JavaScript.',
    problems: 180,
    level: 'Intermediate',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
    color: 'bg-yellow-500',
  },
];

export const CONTESTS: Contest[] = [
    { title: 'Weekly Contest #345', startTime: 'Starts in 2d 4h', duration: '90 mins', participants: 1254 },
    { title: 'Biweekly Contest #101', startTime: 'Starts in 9d 6h', duration: '120 mins', participants: 876 },
];

export const PAST_CONTESTS: PastContest[] = [
    { name: 'Weekly Contest #344', date: 'July 15, 2024' },
    { name: 'Biweekly Contest #100', date: 'July 8, 2024' },
    { name: 'Weekly Contest #343', date: 'July 1, 2024' },
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
    { rank: 1, name: 'Himanshu', score: 2450 },
    { rank: 2, name: 'Ben', score: 2380 },
    { rank: 3, name: 'Charlie', score: 2310 },
    { rank: 4, name: 'David', score: 2250 },
    { rank: 5, name: 'Eva', score: 2200 },
];

export const CONTEST_PROBLEMS: ContestProblem[] = [
    { id: 'A', title: 'Two Sum Variant', difficulty: 'Easy', points: 3 },
    { id: 'B', title: 'Find Subarray with Given Sum', difficulty: 'Medium', points: 4 },
    { id: 'C', title: 'Minimum Window Substring', difficulty: 'Hard', points: 6 },
    { id: 'D', title: 'Trapping Rain Water II', difficulty: 'Hard', points: 7 },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
    { id: 1, title: 'Two Sum', status: 'Accepted', timestamp: '2 hours ago' },
    { id: 2, title: 'Median of Two Sorted Arrays', status: 'Wrong Answer', timestamp: '1 day ago' },
    { id: 3, title: 'Longest Palindromic Substring', status: 'Accepted', timestamp: '3 days ago' },
    { id: 4, title: 'Regular Expression Matching', status: 'Time Limit Exceeded', timestamp: '5 days ago' },
];