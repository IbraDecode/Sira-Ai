export const MODELS = {
  "gemini-2.0-flash-exp": {
    name: "Gemini 2.0 Flash",
    description: "Fast and efficient model for quick responses",
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    description: "Latest model with improved capabilities",
  },
} as const;

export const DEFAULT_PLUGINS: Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    icon: "🌐",
  },
  {
    id: "document-summary",
    name: "Document Summary",
    description: "Summarize documents and files",
    icon: "📄",
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Execute and analyze code snippets",
    icon: "💻",
  },
];

export const DEFAULT_PERSONALITIES = [
  {
    id: "default",
    name: "SIRA - Default",
    description: "Helpful, friendly, and professional AI assistant",
    prompt:
      "Kamu adalah SIRA AI, asisten AI yang cerdas, ramah, dan profesional. Kamu membantu user dengan penjelasan yang jelas dan detail.",
  },
  {
    id: "creative",
    name: "Creative Helper",
    description: "Creative and expressive AI for brainstorming",
    prompt:
      "Kamu adalah AI yang kreatif dan ekspresif. Kamu suka membantu dengan ide-ide baru dan pendekatan yang inovatif.",
  },
  {
    id: "code",
    name: "Code Expert",
    description: "Technical AI focused on programming and development",
    prompt:
      "Kamu adalah ahli programming yang berpengalaman. Kamu fokus pada solusi teknis, best practices, dan code quality.",
  },
  {
    id: "tutor",
    name: "Learning Tutor",
    description: "Patient AI tutor for learning and education",
    prompt:
      "Kamu adalah tutor yang sabar dan detail. Kamu menjelaskan konsep dengan cara yang mudah dipahami, step by step.",
  },
];

export const SUPPORTED_FILE_TYPES = {
  text: [".txt", ".md", ".csv", ".json"],
  document: [".pdf", ".docx", ".doc"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  code: [".js", ".ts", ".py", ".java", ".cpp", ".c", ".go", ".rs"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_MESSAGE_LENGTH = 10000;
