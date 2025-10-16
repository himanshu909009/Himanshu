

import { GoogleGenAI, Type } from "@google/genai";
// Fix: Use 'import type' for type-only imports and combine them.
import type { Language, SimulationOutput } from '../types';

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
            },
            required: ["stdout", "stderr"],
        },
    },
    required: ["compilation", "execution", "output"],
};

export async function runCodeSimulation(
  code: string,
  language: Language,
  input: string
): Promise<SimulationOutput> {
  const prompt = `
    You are a virtual code runner. Your task is to simulate the compilation and execution of the provided code snippet. You must act exactly like a real compiler and runtime environment (e.g., GCC, Python interpreter, JVM).

    **Input:**
    - Language: ${language}
    - Code:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
    - Standard Input (stdin):
    \`\`\`
    ${input}
    \`\`\`

    **Instructions:**
    1.  **Analyze the code:** Check for syntax errors first.
    2.  **Simulate Compilation (if applicable for the language):**
        *   If there are syntax errors, stop and report them in the \`compilation\` field. The \`output\` and \`execution\` fields should be empty. **Crucially, if the error message contains a line and column number, you MUST extract them into the \`line\` and \`column\` fields respectively.**
        *   If compilation is successful, report success. For interpreted languages like Python/JS, the message should reflect that.
    3.  **Simulate Execution:**
        *   If compilation succeeded, simulate running the code with the provided standard input.
        *   Check for runtime errors (e.g., division by zero, index out of bounds). If a runtime error occurs, report it in the \`output.stderr\` field.
        *   If the code runs successfully, capture its standard output (stdout) and place it in the \`output.stdout\` field.
    4.  **Format the Output:**
        *   You MUST respond with a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, backticks, or explanations outside of the JSON structure.
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

    // Basic validation to ensure the parsed object fits the expected structure.
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