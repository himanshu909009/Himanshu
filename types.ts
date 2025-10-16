// Fix: Define and export the 'Language' type, which was missing.
export type Language = string;

// Fix: Define and export the 'LanguageOption' interface, which was missing.
export interface LanguageOption {
  id: Language;
  name: string;
}

// Fix: Define and export the 'SimulationOutput' interface, which was missing.
export interface SimulationOutput {
  compilation: {
    status: 'success' | 'error';
    message: string;
  };
  execution: {
    stdin: string;
  };
  output: {
    stdout: string;
    stderr: string;
  };
}

export interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
}
