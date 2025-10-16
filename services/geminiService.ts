

import { GoogleGenAI, Type } from "@google/genai";
// Fix: Use 'import type' for type-only imports and combine them.
import type { Language, SimulationOutput, VirtualFile } from '../types';

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