

import { GoogleGenAI, Type } from "@google/genai";
// Fix: Use 'import type' for type-only imports and combine them.
import type { Language, SimulationOutput, VirtualFile, TestCase } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        compilation: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, enum: ["success", "error"] },
                message: { type: Type.STRING },
                line: { type: Type.NUMBER, description: "The line number of the error, if applicable." },
                column: { type: Type.NUMBER, description: "The column number or character position of the error, if applicable." },
            },
            required: ["status", "message"],
        },
        execution: {
            type: Type.OBJECT,
            properties: {
                stdin: { type: Type.STRING },
            },
            required: ["stdin"],
        },
        output: {
            type: Type.OBJECT,
            properties: {
                stdout: { type: Type.STRING },
                stderr: { type: Type.STRING },
                transcript: {
                    type: Type.ARRAY,
                    description: "A structured transcript of the interactive session, showing stdin and stdout interleaved chronologically.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ["stdout", "stdin", "stderr"] },
                            content: { type: Type.STRING },
                        },
                        required: ["type", "content"],
                    }
                },
                timeUsage: { type: Type.NUMBER, description: "Execution time in milliseconds." },
                memoryUsage: { type: Type.NUMBER, description: "Memory usage in kilobytes." },
                isExecutionFinished: { type: Type.BOOLEAN, description: "Set to true if the program has run to completion. Set to false if it is currently blocked and waiting for more stdin." },
                files: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            content: { type: Type.STRING },
                        },
                        required: ["id", "name", "content"],
                    }
                }
            },
            required: ["stdout", "stderr", "isExecutionFinished"],
        },
    },
    required: ["compilation", "execution", "output"],
};

export async function runCodeSimulation(
  language: Language,
  files: VirtualFile[],
  activeFileId: string,
  input: string
): Promise<SimulationOutput> {
  const activeFile = files.find(f => f.id === activeFileId);
  if (!activeFile) {
      throw new Error("No active file found to run.");
  }

  const prompt = `
    You are a virtual code runner with a file system. Your task is to simulate the compilation and execution of the provided code. Act exactly like a real environment (e.g., GCC, Python interpreter).

    **Execution Context:**
    - The entrypoint for execution is the file named: "${activeFile.name}"
    - Language: ${language}

    **Virtual File System:**
    The user has provided the following files. The code can read from and write to these files as if they were on a local disk.
    ${files.map(f => `
    - File Name: "${f.name}"
      Content:
      \`\`\`
      ${f.content}
      \`\`\`
    `).join('')}

    **Standard Input (stdin):**
    \`\`\`
    ${input}
    \`\`\`

    **Instructions:**
    1.  **Analyze and Compile:**
        *   Analyze the entrypoint file ("${activeFile.name}") for syntax errors.
        *   If there are compilation errors, stop. Report them in \`compilation\`. **If the error has a line/column, you MUST extract them.**
        *   If compilation succeeds, report success.
    2.  **Simulate Execution & Performance:**
        *   Run the code. If the provided stdin is not sufficient for the program to run to completion, simulate the execution up to the point where the program is waiting for the next piece of input.
        *   **Simulate performance:** Provide realistic estimates for \`timeUsage\` (in milliseconds) and \`memoryUsage\` (in kilobytes). For simple 'Hello World' programs, this should be very low (e.g., < 5ms, < 1024KB).
        *   **Simulate File I/O:** If the code writes to a file (new or existing), you must capture the final state of that file.
    3.  **Format the Output:**
        *   You MUST respond with a single, valid JSON object that strictly adheres to the schema.
        *   **Create a Structured Transcript:** In the \`output.transcript\` array, provide a structured log of the execution. This should be an array of objects, where each object represents a chunk of output (\`stdout\`, \`stderr\`) or input (\`stdin\`).
        *   The order of the array elements must represent the chronological order of events. For example: \`[{type: "stdout", content: "Enter name: "}, {type: "stdin", content: "Alice\\n"}, ...]\`.
        *   Combine consecutive prints into a single \`stdout\` part. Each \`stdin\` part should correspond to a single read operation (e.g., one \`scanf\`).
        *   **Indicate Execution State:** In \`output.isExecutionFinished\`, you MUST set it to \`true\` if the program ran to completion or terminated with an error. Set it to \`false\` ONLY if the program is currently blocked and waiting for more standard input.
        *   If the program finishes successfully, append a confirmation message like "\\n\\n=== Code Execution Successful ===" to the end of the stdout/transcript.
        *   **In the \`output.files\` array, return ONLY the files that were created or modified during execution.** Do not return unchanged files. If no files were changed, return an empty array or omit the field.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result.compilation && result.output) {
      return result as SimulationOutput;
    } else {
      throw new Error("Invalid JSON structure received from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to simulate code execution: ${error.message}`);
    }
    throw new Error("An unknown error occurred during code simulation.");
  }
}

export async function getAiErrorExplanation(language: Language, code: string, errorMessage: string): Promise<string> {
    const prompt = `
        You are a friendly and helpful AI coding tutor. A beginner programmer has encountered an error. 
        Your task is to explain the error in a simple, easy-to-understand way and suggest a fix.

        **Language:** ${language}

        **The user's code:**
        \`\`\`${language}
        ${code}
        \`\`\`

        **The compilation error message:**
        \`\`\`
        ${errorMessage}
        \`\`\`

        **Instructions:**
        1.  Start by greeting the user in a friendly tone.
        2.  Explain what the error message means in plain English, avoiding technical jargon as much as possible.
        3.  Point out the specific line or part of the code that is causing the problem.
        4.  Clearly explain *why* it's an error.
        5.  Suggest one or more ways to fix the code. You can provide a corrected code snippet if it's helpful.
        6.  Keep your explanation concise and encouraging.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI explanation:", error);
        return "Sorry, I couldn't analyze the error. Please try again.";
    }
}

export async function getAiCodeFeedback(language: Language, code: string): Promise<string> {
    const prompt = `
        You are a friendly and helpful AI coding tutor. A programmer has written the following code, which has compiled and run successfully. 
        Your task is to review the code and provide helpful feedback.

        **Language:** ${language}

        **The user's code:**
        \`\`\`${language}
        ${code}
        \`\`\`

        **Instructions:**
        1.  Start by congratulating the user on writing code that works.
        2.  Briefly explain what the code does to confirm your understanding.
        3.  Provide one or two suggestions for improvement, if any. This could be about:
            *   **Best Practices:** Is there a more standard or conventional way to write this?
            *   **Efficiency:** Could it be made faster or use less memory?
            *   **Readability:** Can the code be made clearer or easier to understand?
            *   **Alternative Approaches:** Mention a different way to solve the problem, if interesting.
        4.  If the code is already excellent (e.g., a simple "Hello, World!" program), just praise it and keep the feedback positive and brief.
        5.  Keep your tone encouraging and constructive.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI feedback:", error);
        return "Sorry, I couldn't analyze your code. Please try again.";
    }
}

export async function getAiFailureAnalysis(
    language: Language, 
    code: string, 
    testCaseInput: string,
    expectedOutput: string,
    actualOutput: string, // This can be either stdout or stderr
    isRuntimeError: boolean
): Promise<string> {
    const failureType = isRuntimeError ? "produced a runtime error" : "produced the wrong output";
    const actualOutputDescription = isRuntimeError ? "Runtime Error (stderr)" : "Actual Output (stdout)";

    const prompt = `
        You are a friendly and helpful AI coding tutor. A programmer's code has failed a test case.
        Your task is to analyze the code, the input, and the output to explain the logical error and suggest a fix.

        **Language:** ${language}

        **The user's code:**
        \`\`\`${language}
        ${code}
        \`\`\`

        **Test Case Details:**
        - **Input (stdin):**
        \`\`\`
        ${testCaseInput || "(empty)"}
        \`\`\`
        - **Expected Output (stdout):**
        \`\`\`
        ${expectedOutput}
        \`\`\`
        - **Result:** The code ${failureType}.
        - **${actualOutputDescription}:**
        \`\`\`
        ${actualOutput}
        \`\`\`

        **Instructions:**
        1.  Start by greeting the user in a friendly tone and acknowledge that debugging is a normal part of programming.
        2.  Explain the discrepancy. What was the code supposed to do based on the input and expected output? What did it do instead?
        3.  Analyze the user's code to find the most likely logical error that caused this failure. Point to specific lines or blocks of code.
        4.  Explain *why* this part of the code is incorrect for the given test case. For example, "Your loop condition is off-by-one, which causes it to miss the last element," or "You are not handling the edge case where the input is empty."
        5.  Suggest a clear and specific way to fix the code. Provide a corrected code snippet if it's helpful.
        6.  Keep your tone encouraging, constructive, and focused on helping the user learn.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI failure analysis:", error);
        return "Sorry, I couldn't analyze this test case failure. Please try again.";
    }
}
