export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  plan: "free" | "pro";
  joinedAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark";
  language: "id" | "en";
  apiKey?: string;
  apiMode: "global" | "custom";
}

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  model: "gemini-2.0-flash-exp" | "gemini-2.5-flash";
  personality: string;
  plugins: string[];
  memory: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  workspaceId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  files?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Personality {
  id: string;
  userId: string;
  name: string;
  description: string;
  prompt: string;
  model: "gemini-2.0-flash-exp" | "gemini-2.5-flash";
  isPublic: boolean;
  createdAt: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon?: string;
}

export interface ChatRequest {
  workspaceId: string;
  message: string;
  files?: FileAttachment[];
  model?: string;
  personality?: string;
  plugins?: string[];
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
