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
    '#include', '#define', '#ifdef', '#ifndef', '#endif', '#if', '#else'
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
    'xor', 'xor_eq', '#include', '#define'
  ],
  java: [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
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
    'void', 'volatile', 'while', 'with', 'yield', 'async', 'of'
  ],
  python: [
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield'
  ]
};

export const LANGUAGE_FUNCTIONS: Record<Language, string[]> = {
  c: [
    'printf', 'scanf', 'malloc', 'free', 'fopen', 'fclose', 'strcpy', 'strlen', 'sizeof'
  ],
  cpp: [
    'std::cout', 'std::cin', 'std::endl', 'std::vector', 'std::string', 'std::sort', 
    'std::max', 'std::min', 'push_back', 'pop_back', 'size', 'begin', 'end'
  ],
  java: [
    'System.out.println', 'Math.max', 'Math.min', 'String.length', 'ArrayList.add', 
    'ArrayList.get', 'HashMap.put', 'HashMap.get', 'Integer.parseInt'
  ],
  javascript: [
    'console.log', 'Math.max', 'Math.min', 'Array.prototype.push', 'Array.prototype.pop', 
    'Array.prototype.map', 'Array.prototype.filter', 'String.prototype.length', 
    'JSON.parse', 'JSON.stringify', 'document.getElementById'
  ],
  python: [
    'print', 'input', 'len', 'range', 'str', 'int', 'float', 'list.append', 
    'list.pop', 'dict.get', 'sorted', 'max', 'min'
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
  submissions: [
    { id: 1, challengeId: 11, title: 'Largest of Three Numbers', status: 'Accepted', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), language: 'cpp', code: '#include <iostream>\n#include <algorithm>\n\nint main() {\n    int a, b, c;\n    std::cin >> a >> b >> c;\n    int max_val = std::max({a, b, c});\n    std::cout << max_val;\n    return 0;\n}' },
    { id: 2, challengeId: 21, title: 'Matrix Multiplication', status: 'Wrong Answer', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), language: 'cpp', code: '#include <iostream>\n\nint main() {\n    // Incorrect logic\n    std::cout << "1 2 3\\n4 5 6\\n7 8 9";\n    return 0;\n}' },
    { id: 3, challengeId: 8, title: 'Factorial of a Number', status: 'Accepted', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), language: 'cpp', code: '#include <iostream>\n\nlong long factorial(int n) {\n    if (n < 0) return -1; // Or handle error appropriately\n    if (n == 0) return 1;\n    long long result = 1;\n    for (int i = 1; i <= n; ++i) {\n        result *= i;\n    }\n    return result;\n}\n\nint main() {\n    int n;\n    std::cin >> n;\n    std::cout << factorial(n) << std::endl;\n    return 0;\n}' },
    { id: 4, challengeId: 17, title: 'GCD with Recursion', status: 'Time Limit Exceeded', timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), language: 'cpp', code: '#include <iostream>\n\n// Intentionally inefficient to cause TLE\nlong long gcd(long long a, long long b) {\n    while(a != b){\n        if(a > b)\n            a -= b;\n        else\n            b -= a;\n    } \n    return a;\n}\n\nint main() {\n    long long a, b;\n    std::cin >> a >> b;\n    std::cout << gcd(a, b) << std::endl;\n    return 0;\n}' },
    { id: 5, challengeId: 1, title: 'Print "Hello, World!"', status: 'Accepted', timestamp: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), language: 'cpp', code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
  ]
};

export const COURSES: Course[] = [
    { title: 'Object Oriented Programming in C++', category: 'Programming', lessons: 30, hours: 10, level: 'Beginner', color: 'bg-blue-500' },
    { title: 'Data Structures in Java', category: 'Algorithms', lessons: 32, hours: 18, level: 'Intermediate', color: 'bg-red-500' },
    { title: 'Data Structures Using C', category: 'Algorithms', lessons: 45, hours: 25, level: 'Intermediate', color: 'bg-green-500' },
];

export const PRACTICE_LANGUAGES: PracticeProblem[] = [
    { name: 'Practice C++', description: 'Solve C++ Practice problems online with the Practice C++ path on CodeChef. Answer MCQs exercise...', problems: 206, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M51.4 128C23.1 128 0 104.9 0 76.6 0 48.3 23.1 25.2 51.4 25.2c10.2 0 19.8 3 27.9 8.2l-11.4 19.7c-3.8-2.2-8.3-3.6-13.3-3.6-8.9 0-16.7 5.1-20.2 12.6-1.5 3.2-2.3 6.7-2.3 10.4 0 3.7.8 7.2 2.3 10.4 3.5 7.5 11.3 12.6 20.2 12.6 5.1 0 9.7-1.4 13.6-3.8l11.2 19.5c-8.2 5.3-18.1 8.6-28.8 8.6zm50-51.4h-22v-22h-17.4v22h-22v17.4h22v22h17.4v-22h22V76.6z" fill="#004482"/></svg>`, color: 'bg-blue-500' },
    { name: 'Practice Python', description: 'Solve Python coding problems online with Practice Python on CodeChef. Write code for over 19...', problems: 192, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M64 128c35.4 0 64-28.6 64-64S99.4 0 64 0 0 28.6 0 64s28.6 64 64 64z" fill="#306998"/><path d="M87.6 92.8H64c-3.2 0-5.8-2.6-5.8-5.8V70.4c0-4.6 3.6-8.5 8.1-8.9l14.4-1.1c2.2-.2 4-2.1 4-4.4V40.4c0-2.4-1.9-4.4-4.3-4.4H42.7c-2.4 0-4.3 2-4.3 4.4v9.3c0 2.4 2 4.4 4.4 4.4h21.4c3.2 0 5.8 2.6 5.8 5.8v16.6c0 4.6-3.6 8.5-8.1 8.9l-14.4 1.1c-2.2-.2-4 2.1-4 4.4v15.6c0 2.4 1.9 4.4 4.3 4.4h45c2.4 0 4.3-2 4.3-4.4v-9.3c.1-2.4-1.9-4.4-4.3-4.4z" fill="#FFD43B"/><ellipse cx="53.4" cy="51.8" rx="5.8" ry="5.8" fill="#306998"/><ellipse cx="74.6" cy="76.2" rx="5.8" ry="5.8" fill="#306998"/></svg>`, color: 'bg-yellow-500' },
    { name: 'Practice Java', description: 'Complete your Java coding practice with our online Java practice course on CodeChef. Solve over...', problems: 180, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#5382a1"/><path d="M102.4 78.1c-2.6-1.2-4.3-2.6-4.3-5.3 0-2.3 1.2-4.2 3.8-5.7l9.1-5.3c3.4-2 5.1-4.7 5.1-8.1s-1.7-6.2-5.1-8.1l-9-5.3c-2.6-1.5-3.8-3.4-3.8-5.7 0-2.7 1.8-4.2 4.3-5.3 4.2-1.9 6.8-5.1 6.8-9.4 0-6.1-5-11-13.3-11-4.2 0-7.8 1.4-10.3 4-2.6 2.7-3.9 5.8-3.9 9.4 0 5.4 3.7 9.8 9.3 11.5 2.1.6 3.4 1.7 3.4 3.6 0 2.2-1.5 3.6-4.5 5.2l-8.6 4.6c-3.1 1.7-4.7 3.9-4.7 6.7 0 2.8 1.6 5 4.7 6.7l8.6 4.6c3.1 1.7 4.5 3.1 4.5 5.2s-1.3 3-3.4 3.6c-5.6 1.8-9.3 6.1-9.3 11.5 0 3.6 1.3 6.7 3.9 9.4 2.5 2.6 6.1 4 10.3 4 8.3 0 13.3-5 13.3-11 0-4.3-2.6-7.5-6.8-9.4z" fill="#fff"/><path d="M57.4 97.4c-4.3-2-7-5.4-7-10.4V41.3c0-4.9 2.7-8.4 7-10.4 4.3-2 9.5-2 15.6 0 4.3 2 6.9 5.4 6.9 10.4v45.7c0 4.9-2.6 8.4-6.9 10.4-6.2 2-11.3 2-15.6 0zm9-60.8c-1.7-.8-2.6-2.1-2.6-4.2 0-2.3 1-3.9 2.9-4.8 2-.9 4.6-.9 7.9 0 1.9.9 2.8 2.5 2.8 4.8 0 2.1-1 3.4-2.8 4.2-3.3.9-6.2.9-8.2 0z" fill="#f89820"/></svg>`, color: 'bg-orange-700' },
    { name: 'Practice C', description: 'Improve your C programming skills with over 200 coding practice problems. Solve these beginner...', problems: 222, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm33.1 91.8c-4.3 4.3-10.1 6.5-17.4 6.5-6.4 0-12-2.1-16.7-6.2-4.8-4.2-7.8-9.6-9-16.2H89v-14H54.2c.8-6.1 3.6-11.2 8.4-15.3s10.9-6.2 18.2-6.2c6.9 0 12.6 2.1 17.1 6.3 4.5 4.2 6.7 9.8 6.7 16.8H128c0-9.3-2.9-17.5-8.6-24.5-5.7-7-13.6-12.2-23.5-15.5s-21-4.9-33.1-4.9c-12.8 0-24.4 2.1-34.6 6.2s-18.3 10-24.2 17.5-8.8 16.5-8.8 26.9 2.9 19.3 8.8 26.7 13.8 13.2 24.2 17.4 21.8 6.3 34.6 6.3c12.1 0 23-1.7 32.7-5.2s17.8-8.8 24.1-16.2c-5.7-5.9-12.2-8.8-19.5-8.8-7.1.1-13 2.4-17.7 6.9z" fill="#a8b9cc"/></svg>`, color: 'bg-indigo-700' },
    { name: 'Practice Javascript', description: 'Practice JavaScript online with our set of coding problems selected for beginners. Solve these JavaScript...', problems: 169, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M0 0h128v128H0z" fill="#f0db4f"/><path d="M48.4 59.5c.2-2.5 1.7-4.5 4.1-5.6 2.3-1.1 5.3-1.7 8.8-1.7 3.4 0 6.2.4 8.4 1.3 2.2.9 3.8 2.4 4.8 4.6.9 2.1 1.4 4.8 1.4 8s-.5 5.9-1.5 8.1c-1 2.2-2.6 3.8-4.8 4.7-2.2.9-5 1.3-8.3 1.3-4.4 0-7.8-.8-10.3-2.3-2.5-1.6-4.1-3.8-4.8-6.8H36c.9 4.3 3 7.8 6.4 10.5 3.4 2.7 7.7 4.1 13 4.1 4.2 0 8-.7 11.4-2.2 3.4-1.5 6.1-3.7 8-6.6s2.9-6.5 2.9-10.7c0-3-1-6.8-2.1-9.2-1.7-2.6-3.8-4.9-6.3-6.6-2.5-1.8-5.3-3.1-8.5-4-3.2-.8-6.7-1.2-10.5-1.2-5.1 0-9.5 1-13.3 3.1-3.8 2.1-6.5 5-8.1 8.8l10.9 6.5zm40.5 20c-1.3 2.6-3.2 4.6-5.8 5.9-2.6 1.3-5.6 2-9.1 2-3.6 0-6.8-.6-9.5-1.9-2.7-1.3-4.8-3.1-6.3-5.6-1.5-2.5-2.2-5.4-2.2-8.7s.7-6.2 2.2-8.7c1.5-2.5 3.6-4.4 6.3-5.6 2.7-1.2 5.9-1.8 9.5-1.8 3.5 0 6.5.6 9.1 1.9 2.6 1.3 4.5 3.1 5.8 5.7 1.3 2.6 1.9 5.5 1.9 8.7s-.6 6.1-1.9 8.6zm-11-14.7c-1.1-1.3-2.5-2-4.3-2s-3.2.7-4.3 2c-1.1 1.3-1.7 3-1.7 5.2s.6 3.9 1.7 5.1c1.1 1.2 2.5 1.8 4.3 1.8s3.2-.6 4.3-1.8c1.1-1.2 1.7-2.9 1.7-5.1s-.5-3.9-1.7-5.2z"/></svg>`, color: 'bg-yellow-400' },
    { name: 'Projects using HTML / CSS', description: 'Practice HTML and CSS with our on site editor. Code 7 guided projects to build sites. Solve MCQ exercise...', problems: 183, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M12.1 0h103.8L105 114.2 64 128 23.1 114.2 12.1 0z" fill="#e44d26"/><path d="M64 117.1V10.8h41L96 105.1 64 117.1z" fill="#f16529"/><path d="M30.4 21.6h33.6v10.8H35.7l2.1 24h26.2v-10.8H42.3l-2.1-13.2h21.7v34.6L64 86.8v11.5l-19-5.1.1-.9 2.2-25.1-19.4.1 2.2 24.5 33.5 9.1h.1v-10.9l-22.7-6.1-1.5-17.6h24.2V32.4H32.6l-2.2-10.8z" fill="#ebebeb"/><path d="M64 68.2h22.7l-2.1 23-18.5 5.1v-11.5l10.2-2.8.9-10.1H64v-10.8h33.6l-.1 1.3-3.2 35.2-30.3 8.1v10.9l39.5-10.7L102.7 21.6H64v10.8h28.4l-.9 11.2H64v34.6z" fill="#fff"/></svg>`, color: 'bg-orange-500' },
    { name: 'SQL Practice Queries', description: 'Practice queries on Select, Where, Limit, Order by, Aggregates, Group by, Joins, Sub-queries and Case...', problems: 93, level: 'Intermediate level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M128 64c0 35.4-28.6 64-64 64S0 99.4 0 64 28.6 0 64 0s64 28.6 64 64z" fill="#00758f"/><path d="M64 112.8c-27 0-48.8-21.9-48.8-48.8S37 15.2 64 15.2c12.2 0 23.3 4.5 31.8 11.8l-15 14.8c-3.1-2.6-7.2-4.2-11.8-4.2-9.6 0-17.4 7.8-17.4 17.4s7.8 17.4 17.4 17.4c5.1 0 9.7-2.2 12.8-5.8h-12.8V59.4h29.5c.3 1.6.4 3.2.4 4.9 0 18.2-11.5 31.1-28.7 31.1zm33-47.5L84.8 77.5c2.3.1 4.7.2 7 .2 14.1 0 25.6-11.5 25.6-25.6 0-3.3-.6-6.4-1.8-9.3z" fill="#fff"/></svg>`, color: 'bg-blue-700' },
    { name: 'Practice PHP', description: 'Enhance your PHP skills with our hands-on practice course. Master PHP syntax and real-world...', problems: 199, level: 'Beginner level', icon: `<svg width="32" height="32" viewBox="0 0 128 128"><ellipse cx="64" cy="64" rx="64" ry="44" fill="#6181b6"/><text x="26" y="86" font-family="sans-serif" font-size="64" fill="#fff">php</text></svg>`, color: 'bg-indigo-500' },
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

export const COURSE_DETAILS: Record<string, CourseDetails> = {
    'C++': {
        title: 'Comprehensive C++',
        description: 'An in-depth course on C++, covering everything from basic syntax to advanced features like templates, STL, and modern C++ standards. Perfect for beginners and those looking to strengthen their C++ skills for competitive programming and software development.',
        icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M51.4 128C23.1 128 0 104.9 0 76.6 0 48.3 23.1 25.2 51.4 25.2c10.2 0 19.8 3 27.9 8.2l-11.4 19.7c-3.8-2.2-8.3-3.6-13.3-3.6-8.9 0-16.7 5.1-20.2 12.6-1.5 3.2-2.3 6.7-2.3 10.4 0 3.7.8 7.2 2.3 10.4 3.5 7.5 11.3 12.6 20.2 12.6 5.1 0 9.7-1.4 13.6-3.8l11.2 19.5c-8.2 5.3-18.1 8.6-28.8 8.6zm50-51.4h-22v-22h-17.4v22h-22v17.4h22v22h17.4v-22h22V76.6z" fill="#004482"/></svg>`,
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
        icon: `<svg width="32" height="32" viewBox="0 0 128 128"><path d="M64 128c35.4 0 64-28.6 64-64S99.4 0 64 0 0 28.6 0 64s28.6 64 64 64z" fill="#306998"/><path d="M87.6 92.8H64c-3.2 0-5.8-2.6-5.8-5.8V70.4c0-4.6 3.6-8.5 8.1-8.9l14.4-1.1c2.2-.2 4-2.1 4-4.4V40.4c0-2.4-1.9-4.4-4.3-4.4H42.7c-2.4 0-4.3 2-4.3 4.4v9.3c0 2.4 2 4.4 4.4 4.4h21.4c3.2 0 5.8 2.6 5.8 5.8v16.6c0 4.6-3.6 8.5-8.1 8.9l-14.4 1.1c-2.2-.2-4 2.1-4 4.4v15.6c0 2.4 1.9 4.4 4.3 4.4h45c2.4 0 4.3-2 4.3-4.4v-9.3c.1-2.4-1.9-4.4-4.3-4.4z" fill="#FFD43B"/><ellipse cx="53.4" cy="51.8" rx="5.8" ry="5.8" fill="#306998"/><ellipse cx="74.6" cy="76.2" rx="5.8" ry="5.8" fill="#306998"/></svg>`,
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
        icon: `<svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="128" rx="64" fill="#6181b6"/><path d="M40 96V32L88 64L40 96Z" fill="white"/></svg>`,
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
#include <cmath>
#include <algorithm>

// Use this space to implement your solution

int main() {
    // Your code to read input and test the solution goes here
    std::cout << "Experiment boilerplate. Implement your solution." << std::endl;
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
        boilerplateCode: `#include <iostream>\n\nint main() {\n    // Your code here\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n`,
        objective: 'Your first task in any new programming language is to master the art of printing output. Write a C++ program that prints the exact string `Hello, World!` to the console.',
        inputFormat: 'There is no input for this problem.',
        outputFormat: 'Output a single line containing the string "Hello, World!".',
        constraints: 'N/A',
        sampleInput: '',
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
        objective: 'Your task is to take two integers as input and calculate their sum and difference. This will test your ability to handle basic input and perform arithmetic operations.',
        inputFormat: 'A single line containing two space-separated integers, `a` and `b`.',
        outputFormat: 'Print two lines. The first line should contain the sum of `a` and `b`. The second line should contain the difference (`a - b`).',
        constraints: '`1 <= a, b <= 1000`',
        sampleInput: '5 3',
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
        description: 'Create a program that reads a string and an integer, then prints the string repeated.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given a string `S` and an integer `N`, your task is to print the string `S` repeated `N` times consecutively.',
        inputFormat: 'The first line contains an integer `N`.\nThe second line contains a string `S`.',
        outputFormat: 'Print the resulting string on a single line.',
        constraints: '`1 <= N <= 10`\n`1 <= length(S) <= 100`\n`S` contains only lowercase English letters.',
        sampleInput: '3\nabc',
        sampleOutput: 'abcabcabc',
        testCases: [{ id: '1', input: '3\nabc', expectedOutput: 'abcabcabc', isLocked: true }],
    },
    {
        id: 4,
        title: 'Variables of Different Data Types',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '98.0%',
        description: 'Write a program that declares variables of different data types and prints their values.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'This challenge is about understanding C++ data types. You are given an integer, a floating-point number, and a character. Your task is to read them as input and print each one on a new line.',
        inputFormat: 'A single line containing an integer, a float, and a character, each separated by a space.',
        outputFormat: 'Print the integer on the first line, the float on the second line (with 2 decimal places), and the character on the third line.',
        constraints: 'The values will be within the standard range for their respective data types.',
        sampleInput: '10 3.14 z',
        sampleOutput: '10\n3.14\nz',
        testCases: [{ id: '1', input: '10 3.14 z', expectedOutput: '10\n3.14\nz', isLocked: true }],
    },
    {
        id: 5,
        title: 'Celsius to Fahrenheit',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '91.0%',
        description: 'Write a program that converts a temperature from Celsius to Fahrenheit.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given a temperature in Celsius, your task is to convert it to Fahrenheit using the formula `F = (C * 9/5) + 32` and print the result.',
        inputFormat: 'A single line containing a floating-point number `C` representing the temperature in Celsius.',
        outputFormat: 'Print the equivalent temperature in Fahrenheit, rounded to two decimal places.',
        constraints: '`-100.0 <= C <= 100.0`',
        sampleInput: '25.0',
        sampleOutput: '77.00',
        testCases: [{ id: '1', input: '25.0', expectedOutput: '77.00', isLocked: true }],
    },
    {
        id: 6,
        title: 'Circle Area and Circumference',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '90.0%',
        description: 'Calculate the area and circumference of a circle given its radius.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given the radius of a circle, calculate and print its area and circumference. Use `3.14159` as the value for pi (π).',
        inputFormat: 'A single line containing a floating-point number `r` representing the radius.',
        outputFormat: 'Print two lines. The first line should contain the area (`π * r^2`). The second line should contain the circumference (`2 * π * r`). Both values should be rounded to two decimal places.',
        constraints: '`0.0 < r <= 1000.0`',
        sampleInput: '10.0',
        sampleOutput: '314.16\n62.83',
        testCases: [{ id: '1', input: '10.0', expectedOutput: '314.16\n62.83', isLocked: true }],
    },
    {
        id: 7,
        title: 'Basic Arithmetic Operations',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Perform basic arithmetic operations on two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given two integers, `a` and `b`, perform addition, subtraction, multiplication, and integer division. Print the result of each operation on a new line.',
        inputFormat: 'A single line with two space-separated integers, `a` and `b`.',
        outputFormat: 'Print four lines:\n1. `a + b`\n2. `a - b`\n3. `a * b`\n4. `a / b` (integer division)',
        constraints: '`1 <= b <= a <= 1000`',
        sampleInput: '10 3',
        sampleOutput: '13\n7\n30\n3',
        testCases: [{ id: '1', input: '10 3', expectedOutput: '13\n7\n30\n3', isLocked: true }],
    },
    {
        id: 8,
        title: 'Factorial of a Number',
        difficulty: 'Medium',
        category: 'Functions',
        maxScore: 20,
        successRate: '85.0%',
        description: 'Calculate the factorial of a given non-negative integer.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'The factorial of a non-negative integer `n`, denoted by `n!`, is the product of all positive integers less than or equal to `n`. For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`. By definition, `0! = 1`. Your task is to write a program that calculates the factorial of a given integer `N`.',
        inputFormat: 'A single line containing one integer, `N`.',
        outputFormat: 'Print a single integer representing the factorial of `N`.',
        constraints: '`0 <= N <= 12`',
        sampleInput: '5',
        sampleOutput: '120',
        testCases: [{ id: '1', input: '5', expectedOutput: '120', isLocked: true }],
    },
    {
        id: 9,
        title: 'Bitwise Operators',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '88.0%',
        description: 'Perform bitwise AND, OR, and XOR on two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given two integers, `a` and `b`, compute their bitwise AND (`a & b`), bitwise OR (`a | b`), and bitwise XOR (`a ^ b`).',
        inputFormat: 'A single line containing two space-separated integers, `a` and `b`.',
        outputFormat: 'Print three integers on separate lines: the result of the AND, OR, and XOR operations, respectively.',
        constraints: '`0 <= a, b <= 1023`',
        sampleInput: '10 6',
        sampleOutput: '2\n14\n12',
        testCases: [{ id: '1', input: '10 6', expectedOutput: '2\n14\n12', isLocked: true }],
    },
    {
        id: 10,
        title: 'Check Number Sign',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '97.0%',
        description: 'Check if a number is positive, negative, or zero.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given an integer, determine if it is positive, negative, or zero. This challenge tests your understanding of basic conditional statements (`if-else`).',
        inputFormat: 'A single line containing an integer `N`.',
        outputFormat: 'Print "Positive", "Negative", or "Zero" (without quotes) based on the value of `N`.',
        constraints: '`-10^9 <= N <= 10^9`',
        sampleInput: '-5',
        sampleOutput: 'Negative',
        testCases: [{ id: '1', input: '-5', expectedOutput: 'Negative', isLocked: true }, { id: '2', input: '0', expectedOutput: 'Zero', isLocked: true }, { id: '3', input: '100', expectedOutput: 'Positive', isLocked: true }],
    },
    {
        id: 11,
        title: 'Largest of Three Numbers',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '96.0%',
        description: 'Find the largest of three given integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given three integers, `a`, `b`, and `c`, your task is to find and print the largest one among them.',
        inputFormat: 'A single line containing three space-separated integers.',
        outputFormat: 'Print a single integer which is the largest of the three.',
        constraints: '`-10^9 <= a, b, c <= 10^9`',
        sampleInput: '10 50 20',
        sampleOutput: '50',
        testCases: [{ id: '1', input: '10 50 20', expectedOutput: '50', isLocked: true }],
    },
    {
        id: 12,
        title: 'Grading System',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '93.0%',
        description: 'Assign a grade based on a student\'s score.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'A school has the following grading system:\n- Score >= 90: Grade A\n- 80 <= Score < 90: Grade B\n- 70 <= Score < 80: Grade C\n- 60 <= Score < 70: Grade D\n- Score < 60: Grade F\nGiven a student\'s score, determine their grade.',
        inputFormat: 'A single line containing an integer `score`.',
        outputFormat: 'Print the corresponding character grade.',
        constraints: '`0 <= score <= 100`',
        sampleInput: '85',
        sampleOutput: 'B',
        testCases: [{ id: '1', input: '85', expectedOutput: 'B', isLocked: true }],
    },
    {
        id: 13,
        title: 'Print Numbers with For Loop',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '99.0%',
        description: 'Print numbers from 1 to N using a for loop.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given an integer `N`, your task is to print all integers from 1 to `N`, each on a new line. This is a fundamental exercise for practicing loops.',
        inputFormat: 'A single integer `N`.',
        outputFormat: 'Print `N` lines, with each line containing a number from 1 to `N` in increasing order.',
        constraints: '`1 <= N <= 100`',
        sampleInput: '5',
        sampleOutput: '1\n2\n3\n4\n5',
        testCases: [{ id: '1', input: '5', expectedOutput: '1\n2\n3\n4\n5', isLocked: true }],
    },
    {
        id: 14,
        title: 'Sum of Even Numbers',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Calculate the sum of all even numbers up to N.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given an integer `N`, find the sum of all even numbers from 1 to `N` (inclusive). For example, if `N` is 10, the even numbers are 2, 4, 6, 8, 10, and their sum is 30.',
        inputFormat: 'A single integer `N`.',
        outputFormat: 'Print a single integer representing the sum.',
        constraints: '`1 <= N <= 1000`',
        sampleInput: '10',
        sampleOutput: '30',
        testCases: [{ id: '1', input: '10', expectedOutput: '30', isLocked: true }],
    },
    {
        id: 15,
        title: 'Multiplication Table',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '92.0%',
        description: 'Print the multiplication table for a given number.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given an integer `N`, print its multiplication table from 1 to 10 in the format `N x i = result`.',
        inputFormat: 'A single integer `N`.',
        outputFormat: 'Print 10 lines, each showing the multiplication of `N` with numbers from 1 to 10.',
        constraints: '`1 <= N <= 100`',
        sampleInput: '5',
        sampleOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
        testCases: [{ id: '1', input: '5', expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50', isLocked: true }],
    },
    {
        id: 16,
        title: 'Function: Calculate Square',
        difficulty: 'Easy',
        category: 'Functions',
        maxScore: 10,
        successRate: '98.0%',
        description: 'Use a function to calculate the square of a number.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'To practice modular programming, create a function that takes an integer as input and returns its square. Then, call this function from your `main` function to compute the square of a given number.',
        inputFormat: 'A single integer `N`.',
        outputFormat: 'Print the square of `N`.',
        constraints: '`-1000 <= N <= 1000`',
        sampleInput: '9',
        sampleOutput: '81',
        testCases: [{ id: '1', input: '9', expectedOutput: '81', isLocked: true }],
    },
    {
        id: 17,
        title: 'GCD with Recursion',
        difficulty: 'Medium',
        category: 'Functions',
        maxScore: 20,
        successRate: '87.0%',
        description: 'Find the greatest common divisor (GCD) of two integers using recursion.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'The greatest common divisor (GCD) of two integers is the largest positive integer that divides both numbers without leaving a remainder. Implement a recursive function to find the GCD of two numbers using the Euclidean algorithm.',
        inputFormat: 'A single line containing two space-separated integers, `a` and `b`.',
        outputFormat: 'Print a single integer representing the GCD of `a` and `b`.',
        constraints: '`1 <= a, b <= 10^9`',
        sampleInput: '48 18',
        sampleOutput: '6',
        testCases: [{ id: '1', input: '48 18', expectedOutput: '6', isLocked: true }],
    },
    {
        id: 18,
        title: 'Function Pointers for Arithmetic',
        difficulty: 'Medium',
        category: 'Pointers',
        maxScore: 20,
        successRate: '80.0%',
        description: 'Use function pointers to call different arithmetic functions.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'This challenge tests your understanding of function pointers. Create four functions: `add`, `subtract`, `multiply`, and `divide`. Then, based on a character input (`+`, `-`, `*`, `/`), use a function pointer to call the corresponding function on two given integers.',
        inputFormat: 'The first line contains two space-separated integers. The second line contains a single character operator.',
        outputFormat: 'Print the result of the operation.',
        constraints: 'The divisor will not be zero for `/` operation.',
        sampleInput: '10 5\n*',
        sampleOutput: '50',
        testCases: [{ id: '1', input: '10 5\n*', expectedOutput: '50', isLocked: true }],
    },
    {
        id: 19,
        title: 'Initialize and Print an Array',
        difficulty: 'Easy',
        category: 'Arrays',
        maxScore: 10,
        successRate: '99.0%',
        description: 'Read N integers into an array and print them.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'The first step to mastering arrays is to read data into them and print it back out. You will be given an integer `N`, followed by `N` integers. Store these integers in an array and then print them, each on a new line.',
        inputFormat: 'The first line contains an integer `N`. The second line contains `N` space-separated integers.',
        outputFormat: 'Print the `N` integers from the array, each on a new line.',
        constraints: '`1 <= N <= 100`',
        sampleInput: '5\n1 2 3 4 5',
        sampleOutput: '1\n2\n3\n4\n5',
        testCases: [{ id: '1', input: '5\n1 2 3 4 5', expectedOutput: '1\n2\n3\n4\n5', isLocked: true }],
    },
    {
        id: 20,
        title: 'Reverse an Array',
        difficulty: 'Easy',
        category: 'Arrays',
        maxScore: 10,
        successRate: '93.0%',
        description: 'Reverse the elements of a given array.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given an array of `N` integers, your task is to reverse it and print the reversed array.',
        inputFormat: 'The first line contains an integer `N`. The second line contains `N` space-separated integers.',
        outputFormat: 'Print the `N` integers of the reversed array, separated by spaces.',
        constraints: '`1 <= N <= 100`',
        sampleInput: '5\n1 2 3 4 5',
        sampleOutput: '5 4 3 2 1',
        testCases: [{ id: '1', input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isLocked: true }],
    },
    {
        id: 21,
        title: 'Matrix Multiplication',
        difficulty: 'Medium',
        category: 'Arrays',
        maxScore: 20,
        successRate: '82.0%',
        description: 'Multiply two 3x3 matrices.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given two 3x3 matrices, `A` and `B`, compute their product `C = A * B`. This is a classic problem to practice nested loops and 2D array manipulation.',
        inputFormat: 'The first three lines contain matrix `A` (3 rows, 3 columns). The next three lines contain matrix `B`. Each line has 3 space-separated integers.',
        outputFormat: 'Print the resulting 3x3 matrix `C`, with each row on a new line and elements separated by spaces.',
        constraints: 'Matrix elements will be between `-100` and `100`.',
        sampleInput: '1 2 3\n4 5 6\n7 8 9\n9 8 7\n6 5 4\n3 2 1',
        sampleOutput: '30 24 18\n84 69 54\n138 114 90',
        testCases: [{ id: '1', input: '1 2 3\n4 5 6\n7 8 9\n9 8 7\n6 5 4\n3 2 1', expectedOutput: '30 24 18\n84 69 54\n138 114 90', isLocked: true }],
    },
    {
        id: 22,
        title: 'Pointer Basics',
        difficulty: 'Easy',
        category: 'Pointers',
        maxScore: 10,
        successRate: '95.0%',
        description: 'Demonstrate pointer declaration, initialization, and dereferencing.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'This exercise will help you understand the fundamentals of pointers. Given an integer, you need to declare a pointer to it, and then print the value of the integer, its memory address, and the value accessed through the pointer.',
        inputFormat: 'A single integer `N`.',
        outputFormat: 'Print three lines:\n1. The value of `N`.\n2. The memory address of `N` (output may vary).\n3. The value of `N` accessed via the pointer.',
        constraints: '`1 <= N <= 1000`',
        sampleInput: '42',
        sampleOutput: '42\n(some memory address)\n42',
        testCases: [{ id: '1', input: '42', expectedOutput: '42\n42', isLocked: true }], // Address is non-deterministic
    },
    {
        id: 23,
        title: 'Swap Values with Pointers',
        difficulty: 'Easy',
        category: 'Pointers',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Use pointers to swap the values of two integers.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Write a function that takes two integer pointers as arguments and swaps the values stored at those memory locations. This technique, known as "pass-by-reference", is a core concept in C++.',
        inputFormat: 'A single line containing two space-separated integers, `a` and `b`.',
        outputFormat: 'Print the values of `a` and `b` after swapping, separated by a space.',
        constraints: '`-10^9 <= a, b <= 10^9`',
        sampleInput: '10 5',
        sampleOutput: '5 10',
        testCases: [{ id: '1', input: '10 5', expectedOutput: '5 10', isLocked: true }],
    },
    {
        id: 24,
        title: 'Dynamic Memory Allocation',
        difficulty: 'Medium',
        category: 'Pointers',
        maxScore: 20,
        successRate: '85.0%',
        description: 'Dynamically allocate memory for an array, populate it, and print it.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Practice dynamic memory management. Read an integer `N`, dynamically allocate an array of `N` integers, read `N` values into it, print the values, and then free the allocated memory.',
        inputFormat: 'The first line contains `N`. The second line contains `N` space-separated integers.',
        outputFormat: 'Print the `N` integers from the dynamically allocated array, separated by spaces.',
        constraints: '`1 <= N <= 100`',
        sampleInput: '5\n10 20 30 40 50',
        sampleOutput: '10 20 30 40 50',
        testCases: [{ id: '1', input: '5\n10 20 30 40 50', expectedOutput: '10 20 30 40 50', isLocked: true }],
    },
    {
        id: 25,
        title: 'Simple Rectangle Class',
        difficulty: 'Easy',
        category: 'OOP',
        maxScore: 10,
        successRate: '96.0%',
        description: 'Create a simple Rectangle class with a method to calculate its area.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Your introduction to Object-Oriented Programming! Define a `Rectangle` class with integer attributes `width` and `height`. It should have a method `getArea()` that returns the area of the rectangle.',
        inputFormat: 'A single line with two space-separated integers representing width and height.',
        outputFormat: 'Print the area of the rectangle.',
        constraints: '`1 <= width, height <= 100`',
        sampleInput: '10 5',
        sampleOutput: '50',
        testCases: [{ id: '1', input: '10 5', expectedOutput: '50', isLocked: true }],
    },
    {
        id: 26,
        title: 'Class with Constructor',
        difficulty: 'Easy',
        category: 'OOP',
        maxScore: 10,
        successRate: '94.0%',
        description: 'Write a class with a constructor to initialize attributes.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a `Student` class with `name` (string) and `score` (int) attributes. Implement a constructor that takes the name and score as arguments to initialize the object. Also, create a `display()` method to print the student\'s details.',
        inputFormat: 'A single line with a string (name) and an integer (score), separated by a space.',
        outputFormat: 'Print in the format: `Name: [student_name], Score: [student_score]`',
        constraints: 'Name will not contain spaces.',
        sampleInput: 'Alice 95',
        sampleOutput: 'Name: Alice, Score: 95',
        testCases: [{ id: '1', input: 'Alice 95', expectedOutput: 'Name: Alice, Score: 95', isLocked: true }],
    },
    {
        id: 27,
        title: 'Operator Overloading',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '83.0%',
        description: 'Overload the addition operator for a custom class.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a `Complex` number class with `real` and `imag` (imaginary) parts. Overload the `+` operator so that you can add two `Complex` objects together just like regular numbers. `(a+bi) + (c+di) = (a+c) + (b+d)i`',
        inputFormat: 'Two lines, each containing two space-separated integers for the real and imaginary parts of a complex number.',
        outputFormat: 'Print the resulting complex number in the format `real+imagi` (e.g., `5+10i`).',
        constraints: 'Real and imaginary parts will be between `-100` and `100`.',
        sampleInput: '2 3\n4 5',
        sampleOutput: '6+8i',
        testCases: [{ id: '1', input: '2 3\n4 5', expectedOutput: '6+8i', isLocked: true }],
    },
    {
        id: 28,
        title: 'Basic Inheritance',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '88.0%',
        description: 'Demonstrate inheritance by creating a base and derived class.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Create a base class `Shape` with a string attribute `color`. Then, create a derived class `Rectangle` that inherits from `Shape` and has `width` and `height` attributes. The `Rectangle` class should be able to store its dimensions and its color.',
        inputFormat: 'A string for color, and two integers for width and height, each on a new line.',
        outputFormat: 'Print `Color: [color], Area: [area]`',
        constraints: '`1 <= width, height <= 100`',
        sampleInput: 'Blue\n10\n5',
        sampleOutput: 'Color: Blue, Area: 50',
        testCases: [{ id: '1', input: 'Blue\n10\n5', expectedOutput: 'Color: Blue, Area: 50', isLocked: true }],
    },
    {
        id: 29,
        title: 'Polymorphism with Virtual Functions',
        difficulty: 'Medium',
        category: 'OOP',
        maxScore: 20,
        successRate: '86.0%',
        description: 'Use virtual functions to achieve polymorphism.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Demonstrate runtime polymorphism. Create a base class `Animal` with a virtual method `speak()`. Create two derived classes, `Dog` and `Cat`, that override `speak()` to print "Woof" and "Meow" respectively. Your main function will use a base class pointer to call the correct method.',
        inputFormat: 'A single string, either "Dog" or "Cat".',
        outputFormat: 'Print "Woof" if the input is "Dog", and "Meow" if the input is "Cat".',
        constraints: 'Input will always be either "Dog" or "Cat".',
        sampleInput: 'Cat',
        sampleOutput: 'Meow',
        testCases: [{ id: '1', input: 'Cat', expectedOutput: 'Meow', isLocked: true }, { id: '2', input: 'Dog', expectedOutput: 'Woof', isLocked: true }],
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
        objective: 'Showcase multiple inheritance. Create a `Person` class with a `name` and a `speak()` method. Create an `Employee` class with an `employeeId` and a `work()` method. Then, create a `Manager` class that inherits from both `Person` and `Employee` and can use methods from both base classes.',
        inputFormat: 'A string for the name and an integer for the employee ID, on separate lines.',
        outputFormat: 'Two lines of output, demonstrating calls to methods from both parent classes.',
        constraints: '`1 <= employeeId <= 10000`',
        sampleInput: 'John\n1234',
        sampleOutput: 'My name is John\nI am working with ID: 1234',
        testCases: [{ id: '1', input: 'John\n1234', expectedOutput: 'My name is John\nI am working with ID: 1234', isLocked: true }],
    },
    {
        id: 31,
        title: 'Simple Calculator',
        difficulty: 'Easy',
        category: 'Control Flow',
        maxScore: 10,
        successRate: '90.0%',
        description: 'Create a simple calculator that performs basic arithmetic operations.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Write a program that takes two floating-point numbers and an operator (+, -, *, /) as input and performs the corresponding calculation.',
        inputFormat: 'A single line containing two floats and a character operator, separated by spaces.',
        outputFormat: 'Print the result of the calculation, rounded to two decimal places.',
        constraints: 'The divisor will not be zero for the `/` operation.',
        sampleInput: '10.5 * 2.0',
        sampleOutput: '21.00',
        testCases: [{ id: '1', input: '10.5 * 2.0', expectedOutput: '21.00', isLocked: true }],
    },
    {
        id: 32,
        title: 'Swap Two Numbers',
        difficulty: 'Easy',
        category: 'Functions',
        maxScore: 10,
        successRate: '95.0%',
        description: 'Swap the values of two integer variables.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Your task is to swap the values of two given integers. After swapping, the first number should hold the value of the second, and the second should hold the value of the first.',
        inputFormat: 'A single line containing two space-separated integers, `a` and `b`.',
        outputFormat: 'Print the two integers after swapping, separated by a space.',
        constraints: '`-10^9 <= a, b <= 10^9`',
        sampleInput: '15 30',
        sampleOutput: '30 15',
        testCases: [{ id: '1', input: '15 30', expectedOutput: '30 15', isLocked: true }],
    },
    {
        id: 33,
        title: 'Area and Perimeter of Rectangle',
        difficulty: 'Easy',
        category: 'C++ (Basic)',
        maxScore: 10,
        successRate: '92.0%',
        description: 'Calculate the area and perimeter of a rectangle.',
        isSolved: false,
        boilerplateCode: GENERIC_BOILERPLATE,
        objective: 'Given the length and width of a rectangle, calculate and print its area and perimeter.',
        inputFormat: 'A single line containing two space-separated integers, `length` and `width`.',
        outputFormat: 'Print two lines. The first line should contain the area (`length * width`). The second line should contain the perimeter (`2 * (length + width)`).',
        constraints: '`1 <= length, width <= 1000`',
        sampleInput: '10 5',
        sampleOutput: '50\n30',
        testCases: [{ id: '1', input: '10 5', expectedOutput: '50\n30', isLocked: true }],
    },
];

export const SYLLABUS_MODULES = [
    {
        id: 1,
        title: 'Output & Basic math operators',
        description: 'Practice problems using C++ related to output and output on multiple lines.',
        problems: [
            { title: 'Sum of Two Numbers', difficulty: 'Easy', challengeId: 2 },
            { title: 'Simple Calculator', difficulty: 'Easy', challengeId: 31 },
            { title: 'Swap Two Numbers', difficulty: 'Easy', challengeId: 32 },
            { title: 'Area and Perimeter of Rectangle', difficulty: 'Easy', challengeId: 33 },
            { title: 'Celsius to Fahrenheit Conversion', difficulty: 'Easy', challengeId: 5 },
        ]
    },
    {
        id: 2,
        title: 'Variables and Datatypes',
        description: 'Practice problems related to variables and Datatypes using C++',
        problems: [
            { title: 'Variables of Different Data Types', difficulty: 'Easy', challengeId: 4 },
        ]
    },
    {
        id: 3,
        title: 'Strings',
        description: 'Practice problems related to strings and characters using C++',
        problems: [
             { title: 'Repeat a String', difficulty: 'Easy', challengeId: 3 },
        ]
    },
    {
        id: 4,
        title: 'User inputs',
        description: 'Accept user input and start solving slightly complex problems',
        problems: [
            { title: 'Sum and Difference of Two Numbers', difficulty: 'Easy', challengeId: 2 },
        ]
    },
    {
        id: 5,
        title: 'Algorithmic problems - 1',
        description: 'Practice simple problems on input, output and basic math',
        problems: [
            { title: 'Basic Arithmetic Operations', difficulty: 'Easy', challengeId: 7 },
            { title: 'Circle Area and Circumference', difficulty: 'Easy', challengeId: 6 },
        ]
    },
    {
        id: 6,
        title: 'Conditional statements',
        description: 'Practice problems on conditional statements using If / Else, Combining conditions using And / Or, Switch',
        problems: [
            { title: 'Check Number Sign', difficulty: 'Easy', challengeId: 10 },
            { title: 'Largest of Three Numbers', difficulty: 'Easy', challengeId: 11 },
            { title: 'Grading System', difficulty: 'Easy', challengeId: 12 },
        ]
    },
    {
        id: 7,
        title: 'Debug common errors',
        description: 'Practice debugging common errors that you will encounter while writing code',
        problems: []
    },
    {
        id: 8,
        title: 'Algorithmic problems - 2',
        description: 'A notch higher - lets introduce conditional statements',
        problems: [
            { title: 'Bitwise Operators', difficulty: 'Easy', challengeId: 9 },
        ]
    },
    {
        id: 9,
        title: 'Arrays',
        description: 'Arrays are an integral part of any programming language. Practice problems on arrays using C++',
        problems: [
            { title: 'Initialize and Print an Array', difficulty: 'Easy', challengeId: 19 },
            { title: 'Reverse an Array', difficulty: 'Easy', challengeId: 20 },
            { title: 'Matrix Multiplication', difficulty: 'Medium', challengeId: 21 },
        ]
    },
    {
        id: 10,
        title: 'Loops',
        description: 'Practice problems related to While Loops, For Loops and Break / Continue',
        problems: [
            { title: 'Print Numbers with For Loop', difficulty: 'Easy', challengeId: 13 },
            { title: 'Sum of Even Numbers', difficulty: 'Easy', challengeId: 14 },
            { title: 'Multiplication Table', difficulty: 'Easy', challengeId: 15 },
        ]
    },
    {
        id: 11,
        title: 'Algorithmic problems - 3',
        description: 'Another notch higher - lets introduce Loops',
        problems: [
            { title: 'Factorial of a Number', difficulty: 'Medium', challengeId: 8 },
        ]
    },
    {
        id: 12,
        title: 'Functions',
        description: 'Practice problems that incorporate functions into your code using C++',
        problems: [
            { title: 'Function: Calculate Square', difficulty: 'Easy', challengeId: 16 },
            { title: 'GCD with Recursion', difficulty: 'Medium', challengeId: 17 },
        ]
    },
    {
        id: 13,
        title: 'Pointers',
        description: 'Pointers in C++ are variables that store memory addresses, allowing direct manipulation of data in memory. They enable efficient memory management, dynamic allocation, and provide a powerful way to work with arrays and structures.',
        problems: [
            { title: 'Pointer Basics', difficulty: 'Easy', challengeId: 22 },
            { title: 'Swap Values with Pointers', difficulty: 'Easy', challengeId: 23 },
            { title: 'Dynamic Memory Allocation', difficulty: 'Medium', challengeId: 24 },
            { title: 'Function Pointers for Arithmetic', difficulty: 'Medium', challengeId: 18 },
        ]
    },
    {
        id: 14,
        title: 'Get started with complex algorithmic problems',
        description: 'Practice problems on test cases and custom input / output required to solve algorithmic problems.',
        problems: [
             { title: 'Operator Overloading', difficulty: 'Medium', challengeId: 27 },
             { title: 'Basic Inheritance', difficulty: 'Medium', challengeId: 28 },
             { title: 'Polymorphism with Virtual Functions', difficulty: 'Medium', challengeId: 29 },
             { title: 'Multiple Inheritance', difficulty: 'Medium', challengeId: 30 },
        ]
    }
];
