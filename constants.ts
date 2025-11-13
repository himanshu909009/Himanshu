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

export const INITIAL_USER: User = {
  name: 'Himanshu',
  username: '@alexdoe',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe',
  email: 'alex.doe@example.com',
  college: 'State University',
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

export const CPP_CHALLENGES: Challenge[] = [
    { 
        id: 1, 
        title: 'Say "Hello, World!" With C++', 
        difficulty: 'Easy', 
        category: 'C++ (Basic)', 
        maxScore: 5, 
        successRate: '98.61%', 
        description: 'Practice printing to stdout.', 
        isSolved: true,
        objective: 'This is a simple challenge to help you practice printing to stdout. You may also want to complete Solve Me First in C++ before attempting this challenge.\n\nWe\'re starting out by printing the most famous computing phrase of all time! In the editor below, use either `printf` or `cout` to print the string `Hello, World!` to stdout.\n\nThe more popular command form is `cout`. It has the following basic form:\n`cout<<value_to_print<<value_to_print;`\n\nAny number of values can be printed using one command as shown.\n\nThe `printf` command comes from C language. It accepts an optional format specification and a list of variables. Two examples for printing a string are:\n`printf("%s", string); printf(string);`\n\nNote that neither method adds a newline. It only prints what you tell it to.',
        outputFormat: 'Print `Hello, World!` to stdout.',
        sampleOutput: 'Hello, World!',
        boilerplateCode: '#include <iostream>\n#include <cstdio>\n\nusing namespace std;\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}\n\n\n\n\n\n',
        testCases: [
            { id: '1', input: '', expectedOutput: 'Hello, World!', isLocked: true },
        ],
    },
    { 
        id: 2, 
        title: 'Input and Output', 
        difficulty: 'Easy', 
        category: 'C++ (Basic)', 
        maxScore: 5, 
        successRate: '93.90%', 
        description: 'Practice reading input and printing output.', 
        isSolved: false,
        objective: 'In this challenge, we practice reading input from stdin and printing output to stdout.\n\nYour task is to read 3 integers from stdin and print their sum to stdout.',
        outputFormat: 'Print the sum of the three integers on a single line.',
        sampleOutput: '10',
        boilerplateCode: '#include <cmath>\n#include <cstdio>\n#include <vector>\n#include <iostream>\n#include <algorithm>\n\nusing namespace std;\n\n\nint main() {\n    /* Enter your code here. Read input from STDIN. Print output to STDOUT */   \n    return 0;\n}\n',
        testCases: [
            { id: '1', input: '1 2 7', expectedOutput: '10', isLocked: true }
        ]
    },
    { 
        id: 3, 
        title: 'Basic Data Types', 
        difficulty: 'Easy', 
        category: 'C++ (Basic)', 
        maxScore: 10, 
        successRate: '80.95%', 
        description: 'Learn about C++ data types.', 
        isSolved: false,
        objective: 'This challenge will help you learn about the basic data types in C++. Some of the most commonly used data types are `int`, `long`, `char`, `float`, and `double`.\n\nYour task is to read inputs of these data types from a single line, and then print each value on a new line.',
        outputFormat: 'Print each element on a new line in the same order it was received as input. Note that the floating point numbers should be correct up to 3 and 9 decimal places respectively.',
        sampleOutput: '3\n12345678912345\na\n3.142\n9876.543210987',
        boilerplateCode: '#include <iostream>\n#include <cstdio>\n#include <iomanip>\n\nusing namespace std;\n\nint main() {\n    // Complete the code.\n    return 0;\n}\n',
        testCases: [
            { id: '1', input: '3 12345678912345 a 3.1415926535 9876.543210987', expectedOutput: '3\n12345678912345\na\n3.142\n9876.543210987', isLocked: true }
        ]
    },
    { 
        id: 4, 
        title: 'Conditional Statements', 
        difficulty: 'Easy', 
        category: 'C++ (Basic)', 
        maxScore: 10, 
        successRate: '96.73%', 
        description: 'Use if-else statements to control flow.', 
        isSolved: false,
        objective: 'Given a positive integer, `n`, this challenge will test your knowledge of `if-else` statements.\n\nIf `1 <= n <= 9`, then print the lowercase English word corresponding to the number (e.g., `one` for `1`, `two` for `2`, etc.).\nIf `n > 9`, print `Greater than 9`.',
        outputFormat: 'Print the word corresponding to `n` or `Greater than 9`.',
        sampleOutput: 'five',
        boilerplateCode: '#include <iostream>\n\nusing namespace std;\n\nint main()\n{\n    int n;\n    cin >> n;\n\n    // Write Your Code Here\n\n    return 0;\n}\n',
        testCases: [
            { id: '1', input: '5', expectedOutput: 'five', isLocked: true },
            { id: '2', input: '44', expectedOutput: 'Greater than 9', isLocked: true }
        ]
    },
    { 
        id: 5, 
        title: 'For Loop', 
        difficulty: 'Easy', 
        category: 'C++ (Basic)', 
        maxScore: 10, 
        successRate: '94.92%', 
        description: 'Practice with for loops.', 
        isSolved: false,
        objective: 'A `for` loop is a programming language statement which allows code to be repeatedly executed.\n\nFor each integer `n` in the interval `[a, b]` (inclusive):\n- If `1 <= n <= 9`, then print the English representation of it in lowercase.\n- If `n > 9` and it is an even number, then print `even`.\n- If `n > 9` and it is an odd number, then print `odd`.',
        outputFormat: 'Print the appropriate word representation of `n` on a new line.',
        sampleOutput: 'eight\nnine\neven\nodd',
        boilerplateCode: '#include <iostream>\n#include <cstdio>\n\nusing namespace std;\n\nint main() {\n    // Complete the code.\n    return 0;\n}\n',
        testCases: [
            { id: '1', input: '8 11', expectedOutput: 'eight\nnine\neven\nodd', isLocked: true }
        ]
    },
];