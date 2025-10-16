import type { Language, LanguageOption, Course } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
];

export const DEFAULT_CODE: Record<Language, string> = {
  c: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    printf("Hello, C!");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    // Write your code here\n    std::cout << "Hello, C++!";\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, Java!");\n    }\n}',
  python: '# cook your dish here',
  javascript: '// Write your code here\nconsole.log("Hello, JavaScript!");',
};

export const COURSES: Course[] = [
    { id: 1, title: 'Data Structure', category: 'Tech Programs Content', image: 'https://images.unsplash.com/photo-1526374965328-5f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 2, title: 'Object Oriented Programming in Java', category: 'BTECH24-SEM3', image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 3, title: 'Basics of Compiler Design', category: 'BTECH23-SEM5', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 4, title: 'BCA24 | SEM 2 | Data Structures using C', category: 'Tech Programs Content', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 5, title: 'BCA24 | SEM1 | Foundational Programming in C', category: '2024', image: 'https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { id: 6, title: 'BCA24 | SEM2 | Data Structures in Java', category: '2024', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
];
