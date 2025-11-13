// Fix: Populated the file with constant data used across the application.
import type { Language, LanguageOption, User, Course, PracticeProblem, Contest, PastContest, LeaderboardUser, ContestProblem, RecentActivityItem, CourseDetails, Challenge, Snippet } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
];

export const DEFAULT_CODE: Record<Language, string> = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  javascript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
};

export const CODE_SNIPPETS: Record<Language, Snippet[]> = {
  c: [
    { title: 'For Loop', description: 'A standard for loop.', code: 'for (int i = 0; i < 10; i++) {\n    // code here\n}' },
    { title: 'While Loop', description: 'A standard while loop.', code: 'while (condition) {\n    // code here\n}' },
    { title: 'If-Else', description: 'A conditional statement.', code: 'if (condition) {\n    // code here\n} else {\n    // code here\n}' },
    { title: 'Function', description: 'A basic function definition.', code: 'void functionName() {\n    // code here\n}' },
    { title: 'Read Input (scanf)', description: 'Read integer from stdin.', code: 'int num;\nscanf("%d", &num);' },
  ],
  cpp: [
    { title: 'For Loop', description: 'A standard for loop.', code: 'for (int i = 0; i < 10; ++i) {\n    // code here\n}' },
    { title: 'While Loop', description: 'A standard while loop.', code: 'while (condition) {\n    // code here\n}' },
    { title: 'If-Else', description: 'A conditional statement.', code: 'if (condition) {\n    // code here\n} else {\n    // code here\n}' },
    { title: 'Function', description: 'A basic function definition.', code: 'void functionName() {\n    // code here\n}' },
    { title: 'Class', description: 'A basic class definition.', code: 'class MyClass {\npublic:\n    MyClass() {}\n    ~MyClass() {}\n};' },
    { title: 'Read Input (cin)', description: 'Read integer from stdin.', code: 'int num;\nstd::cin >> num;' },
  ],
  java: [
    { title: 'For Loop', description: 'A standard for loop.', code: 'for (int i = 0; i < 10; i++) {\n    // code here\n}' },
    { title: 'While Loop', description: 'A standard while loop.', code: 'while (condition) {\n    // code here\n}' },
    { title: 'If-Else', description: 'A conditional statement.', code: 'if (condition) {\n    // code here\n} else {\n    // code here\n}' },
    { title: 'Method', description: 'A basic method definition.', code: 'public void methodName() {\n    // code here\n}' },
    { title: 'Class', description: 'A basic class definition.', code: 'class MyClass {\n    public MyClass() {\n        \n    }\n}' },
    { title: 'Read Input (Scanner)', description: 'Read integer from stdin.', code: 'import java.util.Scanner;\n\nScanner scanner = new Scanner(System.in);\nint num = scanner.nextInt();' },
  ],
  javascript: [
    { title: 'For Loop', description: 'A standard for loop.', code: 'for (let i = 0; i < 10; i++) {\n    // code here\n}' },
    { title: 'While Loop', description: 'A standard while loop.', code: 'while (condition) {\n    // code here\n}' },
    { title: 'If-Else', description: 'A conditional statement.', code: 'if (condition) {\n    // code here\n} else {\n    // code here\n}' },
    { title: 'Function', description: 'A basic function definition.', code: 'function functionName() {\n    // code here\n}' },
    { title: 'Arrow Function', description: 'An ES6 arrow function.', code: 'const functionName = () => {\n    // code here\n};' },
    { title: 'Class', description: 'An ES6 class definition.', code: 'class MyClass {\n    constructor() {\n        \n    }\n}' },
  ],
  python: [
    { title: 'For Loop', description: 'A standard for loop.', code: 'for i in range(10):\n    # code here\n    pass' },
    { title: 'While Loop', description: 'A standard while loop.', code: 'while condition:\n    # code here\n    pass' },
    { title: 'If-Else', description: 'A conditional statement.', code: 'if condition:\n    # code here\nelse:\n    # code here\n    pass' },
    { title: 'Function', description: 'A basic function definition.', code: 'def function_name():\n    # code here\n    pass' },
    { title: 'Class', description: 'A basic class definition.', code: 'class MyClass:\n    def __init__(self):\n        pass' },
    { title: 'Read Input', description: 'Read a line from stdin.', code: 'data = input()' },
  ],
};

export const LANGUAGE_KEYWORDS: Record<Language, string[]> = {
  c: [
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
    'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
    'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
    '#include', '#define', '#ifdef', '#ifndef', '#endif', '#if', '#else', 'printf', 'scanf', 'main'
  ],
  cpp: [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case',
    'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl',
    'concept', 'const', 'consteval', 'constexpr', 'constinit', 'const_cast',
    'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default',
    'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
    'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
    'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
    'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
    'public', 'register', 'reinterpret_cast', 'requires', 'return',
    'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast',
    'struct', 'switch', 'template', 'this', 'thread_local',
    'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union',
    'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while',
    'xor', 'xor_eq', '#include', '#define', 'std', 'cout', 'cin', 'endl', 'main'
  ],
  java: [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null',
    'String', 'System', 'out', 'println', 'main'
  ],
  javascript: [
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case',
    'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends',
    'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if',
    'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let',
    'long', 'native', 'new', 'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized',
    'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var',
    'void', 'volatile', 'while', 'with', 'yield', 'async', 'of', 'console', 'log'
  ],
  python: [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield', 'print', 'input', 'range', 'len'
  ]
};


export const INITIAL_USER: User = {
  name: 'Himanshu',
  username: 'himanshu',
  avatarUrl: 'https://i.pravatar.cc/150?u=himanshu_profile',
  email: 'himanshun102@gmail.com',
  college: 'SAGE University',
  course: 'Computer Science',
  stats: [
    { label: 'Rank', value: 1234 },
    { label: 'Problems', value: 150 },
    { label: 'Points', value: 3200 },
  ],
};

export const COURSES: Course[] = [
    { title: 'Object Oriented Programming in C++', category: 'Programming', lessons: 24, hours: 10, level: 'Beginner', color: 'bg-blue-500' },
    { title: 'Data Structures in Java', category: 'Algorithms', lessons: 32, hours: 18, level: 'Intermediate', color: 'bg-red-500' },
    { title: 'Data Structures Using C', category: 'Algorithms', lessons: 45, hours: 25, level: 'Intermediate', color: 'bg-green-500' },
];

const C_PLUS_PLUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 12H16"/><path d="M14 10V14"/><path d="M18 12h4"/><path d="M20 10v4"/><path d="M8 16H4.5a2.5 2.5 0 1 1 0-5H8"/><path d="M5 12v0"/><path d="M20 18a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z"/></svg>`;
const PYTHON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M10.2 2.5c-.2.3-.4.6-.5.9-.3 1.2.3 2.5 1.5 2.8 1.2.3 2.5-.3 2.8-1.5.3-1.2-.3-2.5-1.5-2.8-.3-.1-.7-.1-1 0l-1.3 1.6V15c0 3.3 2.7 6 6 6h2"/><path d="M13.8 21.5c.2-.3.4-.6.5-.9.3-1.2-.3-2.5-1.5-2.8-1.2-.3-2.5.3-2.8 1.5-.3 1.2.3 2.5 1.5 2.8.3.1.7.1 1 0l1.3-1.6V9c0-3.3-2.7-6-6-6H7"/></svg>`;
const ALGORITHMS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>`;

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  { name: 'C++', description: 'Master C++ from basics to advanced topics like OOP and memory management.', problems: 120, level: 'All Levels', icon: C_PLUS_PLUS_ICON, color: 'bg-blue-600' },
  { name: 'Python', description: 'Solve problems with Python, focusing on its clean syntax and powerful libraries.', problems: 150, level: 'All Levels', icon: PYTHON_ICON, color: 'bg-yellow-500' },
];

export const SUBJECT_PROBLEMS: PracticeProblem[] = [
  { name: 'Algorithms', description: 'Sharpen your problem-solving skills with a wide range of algorithmic challenges.', problems: 250, level: 'Intermediate', icon: ALGORITHMS_ICON, color: 'bg-green-600' },
];

export const CONTESTS: Contest[] = [
  { title: 'Weekly Contest #345', startTime: 'Starts in 2d 4h 30m', duration: '90 mins', participants: 1250 },
  { title: 'Biweekly Contest #112', startTime: 'Starts in 9d 4h 30m', duration: '120 mins', participants: 980 },
];

export const PAST_CONTESTS: PastContest[] = [
  { name: 'Weekly Contest #344', date: 'July 15, 2024' },
  { name: 'Weekly Contest #343', date: 'July 8, 2024' },
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  { rank: 1, name: 'CodeMaster', score: 10500 },
  { rank: 2, name: 'AlgoQueen', score: 10250 },
  { rank: 3, name: 'BytePuzzler', score: 9800 },
];

export const CONTEST_PROBLEMS: ContestProblem[] = [
  { id: 'A', title: 'Two Sum Variant', difficulty: 'Easy', points: 300 },
  { id: 'B', title: 'Max Subarray Sum', difficulty: 'Medium', points: 500 },
  { id: 'C', title: 'Binary Tree Paths', difficulty: 'Medium', points: 600 },
  { id: 'D', title: 'Word Ladder', difficulty: 'Hard', points: 1000 },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
  { id: 1, title: 'Two Sum Variant', status: 'Accepted', timestamp: '5 minutes ago' },
  { id: 2, title: 'Max Subarray Sum', status: 'Wrong Answer', timestamp: '1 hour ago' },
  { id: 3, title: 'Binary Tree Paths', status: 'Time Limit Exceeded', timestamp: '3 hours ago' },
];

export const COURSE_DETAILS: Record<string, CourseDetails> = {
    'C++': {
        title: 'Comprehensive C++',
        description: 'An in-depth course on C++, covering everything from basic syntax to advanced features like templates, STL, and modern C++ standards. Perfect for beginners and those looking to strengthen their C++ skills for competitive programming and software development.',
        icon: C_PLUS_PLUS_ICON,
        tags: {
            certification: true,
            rating: '4.8 (1,234 reviews)',
        },
        stats: {
            lessons: 48,
            hours: 30,
            problems: 120,
        },
        modules: [
            { id: 1, title: 'Module 1: C++ Basics', lessons: [
                { id: 1, title: 'Introduction', duration: '10 min', type: 'video' },
                { id: 2, title: 'Variables & Data Types', duration: '20 min', type: 'reading' },
            ]},
            { id: 2, title: 'Module 2: Control Flow', lessons: [
                { id: 3, title: 'If-Else Statements', duration: '15 min', type: 'video' },
                { id: 4, title: 'Loops', duration: '25 min', type: 'practice' },
            ]}
        ]
    },
    'Python': {
        title: 'Python for Problem Solving',
        description: 'Learn Python from scratch and apply it to solve a variety of programming challenges. This course focuses on Python\'s standard library, data structures, and best practices for writing clean, efficient code.',
        icon: PYTHON_ICON,
        tags: {
            certification: true,
            rating: '4.9 (2,500 reviews)',
        },
        stats: {
            lessons: 55,
            hours: 28,
            problems: 150,
        },
        modules: [
            { id: 1, title: 'Module 1: Python Fundamentals', lessons: [
                { id: 1, title: 'Hello, Python!', duration: '8 min', type: 'video' },
                { id: 2, title: 'Lists and Dictionaries', duration: '22 min', type: 'practice' },
            ]}
        ]
    },
    'Algorithms': {
        title: 'Data Structures & Algorithms',
        description: 'A comprehensive guide to common data structures and algorithms. This course is essential for passing technical interviews and improving your problem-solving abilities.',
        icon: ALGORITHMS_ICON,
        tags: {
            certification: true,
            rating: '4.9 (5,100 reviews)',
        },
        stats: {
            lessons: 60,
            hours: 40,
            problems: 250,
        },
        modules: [
            { id: 1, title: 'Module 1: Core Data Structures', lessons: [
                { id: 1, title: 'Arrays and Strings', duration: '30 min', type: 'video' },
                { id: 2, title: 'Linked Lists', duration: '45 min', type: 'practice' },
            ]}
        ]
    }
};

const GENERIC_BOILERPLATE = `#include <iostream>
#include <string>
#include <vector>

// Use this space to implement your solution

int main() {
    // Your code to test the solution goes here
    std::cout << "Experiment boilerplate. Implement your solution above." << std::endl;
    return 0;
}
`;

export const CPP_CHALLENGES: Challenge[] = [
    {
        id: 1,
        title: 'Print "Hello, World!"',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '99.0%',
        description: 'Write a program that prints "Hello, World!" to the console.',
        isSolved: false,
        boilerplateCode: `#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}\n`,
        objective: 'Write a C++ program that outputs the exact string "Hello, World!" to the console.',
        outputFormat: 'The output should be a single line containing "Hello, World!".',
        sampleOutput: 'Hello, World!',
        testCases: [{ id: '1', input: '', expectedOutput: 'Hello, World!', isLocked: true }],
    },
    {
        id: 2,
        title: 'Sum and Difference of Two Numbers',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '95.0%',
        description: 'Write a program that takes two integers as input and prints their sum and difference.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read two integers from standard input, then print their sum and difference on separate lines.',
        outputFormat: 'Two lines of output. The first line should contain the sum, and the second should contain the difference.',
        sampleOutput: '8\n2',
        testCases: [{ id: '1', input: '5 3', expectedOutput: '8\n2', isLocked: true }],
    },
    {
        id: 3,
        title: 'Repeat a String',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '92.0%',
        description: 'Create a program that reads a string and an integer. Print the string repeated as many times as the integer value.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read a string and an integer `n`. Print the string `n` times without any separators.',
    },
    {
        id: 4,
        title: 'Variables of Different Data Types',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '98.0%',
        description: 'Write a program that declares variables of different data types (int, float, char) and prints their values.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Declare an integer, a float, and a character. Initialize them with values and print each on a new line.',
    },
    {
        id: 5,
        title: 'Celsius to Fahrenheit Conversion',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '91.0%',
        description: 'Write a program that converts a temperature from Celsius to Fahrenheit.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read a temperature in Celsius from the user, convert it to Fahrenheit using the formula F = (C * 9/5) + 32, and print the result.',
    },
    {
        id: 6,
        title: 'Circle Area and Circumference',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '90.0%',
        description: 'Create a program that calculates the area and circumference of a circle given its radius.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read a radius, then calculate and print the area (π * r^2) and circumference (2 * π * r). Handle cases where the radius is negative.',
    },
    {
        id: 7,
        title: 'Basic Arithmetic Operations',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Write a program that performs basic arithmetic operations on two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read two integers and print their sum, difference, product, and quotient on separate lines.',
    },
    {
        id: 8,
        title: 'Factorial of a Number',
        difficulty: 'Medium',
        category: 'Functions',
        maxScore: 20,
        successRate: '85.0%',
        description: 'Write a program that calculates the factorial of a number using both iterative and recursive methods.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Implement two functions to calculate the factorial of a given number: one using a loop and one using recursion.',
    },
    {
        id: 9,
        title: 'Bitwise Operators',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '88.0%',
        description: 'Create a program that uses bitwise operators to perform AND, OR, and XOR on two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read two integers and print the result of their bitwise AND, OR, and XOR operations.',
    },
    {
        id: 10,
        title: 'Check if Number is Positive, Negative, or Zero',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '97.0%',
        description: 'Write a program that checks if a number entered by the user is positive, negative, or zero.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read an integer and print "Positive", "Negative", or "Zero" accordingly.',
    },
    {
        id: 11,
        title: 'Largest of Three Numbers',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '96.0%',
        description: 'Write a program that determines the largest of three numbers using nested if-else statements.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read three integers and print the largest one.',
    },
    {
        id: 12,
        title: 'Calculate Grade with Switch Statement',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '93.0%',
        description: 'Create a program that calculates the grade based on the percentage of marks using a switch statement.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read a percentage and print the corresponding grade (e.g., A, B, C) using a switch statement.',
    },
    {
        id: 13,
        title: 'Print Numbers with For Loop',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '99.0%',
        description: 'Write a program that prints numbers from 1 to 10 using a for loop.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Use a for loop to print the numbers from 1 to 10, each on a new line.',
    },
    {
        id: 14,
        title: 'Sum of Even Numbers with While Loop',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Write a program that uses a while loop to calculate the sum of all even numbers between 1 and 100.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Calculate the sum of all even numbers from 2 to 100 using a while loop and print the final sum.',
    },
    {
        id: 15,
        title: 'Multiplication Table with Do-While Loop',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '92.0%',
        description: 'Create a program that prints a multiplication table for a given number using a do-while loop.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read a number and print its multiplication table up to 10 using a do-while loop.',
    },
    {
        id: 16,
        title: 'Calculate Square with a Function',
        difficulty: 'Easy',
        category: 'Functions',
        maxScore: 10,
        successRate: '98.0%',
        description: 'Write a program that defines a function to calculate the square of a number and prints the result.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a function that takes an integer as input, returns its square, and call it from main().',
    },
    {
        id: 17,
        title: 'GCD with Recursion',
        difficulty: 'Medium',
        category: 'Functions',
        maxScore: 20,
        successRate: '87.0%',
        description: 'Write a program that defines a function to calculate the greatest common divisor (GCD) of two integers using recursion.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Implement a recursive function to find the GCD of two numbers using the Euclidean algorithm.',
    },
    {
        id: 18,
        title: 'Function Pointers for Arithmetic',
        difficulty: 'Medium',
        category: 'Pointers',
        maxScore: 20,
        successRate: '80.0%',
        description: 'Create a program that defines multiple functions for arithmetic operations and uses function pointers to call them.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Define functions for add, subtract, multiply, and divide. Use an array of function pointers to call them based on user input.',
    },
    {
        id: 19,
        title: 'Initialize and Print an Array',
        difficulty: 'Easy',
        category: 'Arrays',
        maxScore: 10,
        successRate: '99.0%',
        description: 'Write a program that initializes an array of 5 integers, assigns values to it, and prints the array elements.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Declare an integer array of size 5, initialize it with values, and print each element.',
    },
    {
        id: 20,
        title: 'Reverse an Array',
        difficulty: 'Easy',
        category: 'Arrays',
        maxScore: 10,
        successRate: '93.0%',
        description: 'Write a program that takes 10 integers from the user, stores them in an array, and prints the array in reverse order.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Read 10 integers into an array, then loop through the array backwards to print its elements.',
    },
    {
        id: 21,
        title: 'Matrix Multiplication',
        difficulty: 'Medium',
        category: 'Arrays',
        maxScore: 20,
        successRate: '82.0%',
        description: 'Create a program that multiplies two matrices using two-dimensional arrays and prints the resulting matrix.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Implement matrix multiplication for two 3x3 matrices and print the resultant matrix.',
    },
    {
        id: 22,
        title: 'Pointer Basics',
        difficulty: 'Easy',
        category: 'Pointers',
        maxScore: 10,
        successRate: '95.0%',
        description: 'Write a program that demonstrates pointer declaration, initialization, and dereferencing.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Declare an integer and a pointer to it. Print the value of the integer, its address, and the value accessed via the pointer.',
    },
    {
        id: 23,
        title: 'Swap Values with Pointers',
        difficulty: 'Easy',
        category: 'Pointers',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Write a program that uses pointers to swap the values of two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a function that takes two integer pointers as arguments and swaps the values they point to.',
    },
    {
        id: 24,
        title: 'Dynamic Memory Allocation',
        difficulty: 'Medium',
        category: 'Pointers',
        maxScore: 20,
        successRate: '85.0%',
        description: 'Create a program that dynamically allocates memory for an array of integers, populates it, and prints it.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Dynamically allocate an array of integers using `new`, fill it with values, print them using pointer arithmetic, and then free the memory with `delete[]`.',
    },
    {
        id: 25,
        title: 'Simple Rectangle Class',
        difficulty: 'Easy',
        category: 'OOP',
        maxScore: 10,
        successRate: '96.0%',
        description: 'Write a simple class that represents a Rectangle with attributes for width and height and a method to calculate its area.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Define a `Rectangle` class with width and height members and an `area()` method. Instantiate an object and print its area.',
    },
    {
        id: 26,
        title: 'Class with Constructor and Destructor',
        difficulty: 'Easy',
        category: 'OOP',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Write a class with a constructor, a destructor, and methods to set and get the values of attributes.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a class with a constructor that initializes its members and a destructor that prints a message upon object destruction.',
    },
    {
        id: 27,
        title: 'Operator Overloading',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '83.0%',
        description: 'Create a class that implements operator overloading for arithmetic operations (e.g., addition) between two objects.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a `Complex` number class and overload the `+` operator to add two `Complex` objects.',
    },
    {
        id: 28,
        title: 'Basic Inheritance',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '88.0%',
        description: 'Write a program that demonstrates basic inheritance by creating a base class Shape and a derived class Circle.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a base class `Shape` with a color attribute and a derived class `Circle` that inherits from `Shape` and adds a radius attribute.',
    },
    {
        id: 29,
        title: 'Polymorphism with Virtual Functions',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '86.0%',
        description: 'Write a program that uses virtual functions to achieve polymorphism.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a base class `Animal` with a virtual method `speak()`. Create derived classes `Dog` and `Cat` that override `speak()`. Demonstrate polymorphism using a base class pointer.',
    },
    {
        id: 30,
        title: 'Multiple Inheritance',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '81.0%',
        description: 'Create a program that demonstrates multiple inheritance.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a class `Manager` that inherits from both a `Person` class and an `Employee` class. Demonstrate using methods from both base classes.',
    },
];