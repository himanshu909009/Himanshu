import type { Language } from './types';

export interface CodeTemplate {
  name: string;
  description: string;
  code: string;
}

export const CODE_TEMPLATES: Record<Language, CodeTemplate[]> = {
  c: [
    {
      name: 'Basic I/O',
      description: 'A simple "Hello, World!" program using stdio.h for basic input and output.',
      code: `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
    },
    {
      name: 'File I/O',
      description: 'Template for reading from "input.txt" and writing to "output.txt".',
      code: `#include <stdio.h>

int main() {
    FILE *inputFile, *outputFile;
    inputFile = fopen("input.txt", "r");
    if (inputFile == NULL) {
        printf("Error opening input file\\n");
        return 1;
    }

    outputFile = fopen("output.txt", "w");
    if (outputFile == NULL) {
        printf("Error opening output file\\n");
        fclose(inputFile);
        return 1;
    }

    // Read from inputFile and write to outputFile
    // Example: Read an integer and write it back
    int num;
    fscanf(inputFile, "%d", &num);
    fprintf(outputFile, "The number is: %d\\n", num);

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}`,
    },
  ],
  cpp: [
    {
      name: 'Basic I/O',
      description: 'A simple "Hello, World!" program using iostream for basic input and output.',
      code: `#include <iostream>

int main() {
    // Your code here
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    },
    {
      name: 'Competitive Programming',
      description: 'A common setup for competitive programming with fast I/O and common headers.',
      code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>

void solve() {
    // Your solution logic here
}

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int t = 1;
    // std::cin >> t; // Uncomment for multiple test cases
    while (t--) {
        solve();
    }
    
    return 0;
}`,
    },
    {
      name: 'File I/O',
      description: 'Template for reading from "input.txt" and writing to "output.txt" using fstream.',
      code: `#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream inputFile("input.txt");
    if (!inputFile.is_open()) {
        std::cerr << "Error opening input file" << std::endl;
        return 1;
    }

    std::ofstream outputFile("output.txt");
    if (!outputFile.is_open()) {
        std::cerr << "Error opening output file" << std::endl;
        return 1;
    }

    // Read from inputFile and write to outputFile
    // Example: Read a line and write it back
    std::string line;
    if (std::getline(inputFile, line)) {
        outputFile << "Read from file: " << line << std::endl;
    }

    inputFile.close();
    outputFile.close();

    return 0;
}`,
    },
  ],
  java: [
    {
      name: 'Basic Main Class',
      description: 'A standard public class with a main method, ready for your code.',
      code: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
    },
    {
      name: 'Class Structure',
      description: 'A basic structure for a new Java class, including a standard main method.',
      code: `public class MyClass {
    
    // Fields (instance variables)
    
    // Constructors
    
    // Methods
    
    public static void main(String[] args) {
        // Program entry point
    }
}`
    },
    {
      name: 'Competitive Programming',
      description: 'A setup with a FastReader class for faster input processing in competitive contests.',
      code: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    
    static class FastReader {
        BufferedReader br;
        StringTokenizer st;

        public FastReader() {
            br = new BufferedReader(new InputStreamReader(System.in));
        }

        String next() {
            while (st == null || !st.hasMoreElements()) {
                try {
                    st = new StringTokenizer(br.readLine());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return st.nextToken();
        }

        int nextInt() {
            return Integer.parseInt(next());
        }

        long nextLong() {
            return Long.parseLong(next());
        }

        double nextDouble() {
            return Double.parseDouble(next());
        }

        String nextLine() {
            String str = "";
            try {
                str = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return str;
        }
    }

    public static void main(String[] args) {
        FastReader sc = new FastReader();
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
    },
  ],
  javascript: [
    {
      name: 'Basic Script',
      description: 'A simple script that logs "Hello, World!" to the console.',
      code: `// Your code here
console.log("Hello, World!");`,
    },
    {
      name: 'Node.js Readline',
      description: 'Template for handling I/O in Node.js environments, common in online judges.',
      code: `const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];

rl.on('line', (line) => {
  input.push(line);
}).on('close', () => {
  // Process input and solve the problem
  console.log("Input received:", input);
  process.exit(0);
});`,
    },
  ],
  python: [
    {
      name: 'Basic Script',
      description: 'A simple Python script that prints "Hello, World!".',
      code: `# Your code here
print("Hello, World!")`,
    },
    {
      name: 'Competitive Programming',
      description: 'A common setup for competitive programming with fast I/O and a solve function.',
      code: `import sys

def solve():
    # Your solution logic here
    pass

def main():
    # For fast I/O
    # sys.stdin = open('input.txt', 'r')
    # sys.stdout = open('output.txt', 'w')
    
    t = 1
    # t = int(sys.stdin.readline()) # Uncomment for multiple test cases
    
    for _ in range(t):
        solve()

if __name__ == "__main__":
    main()`,
    },
  ],
};