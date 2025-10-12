import { GoogleGenerativeAI } from "@google/generative-ai";

export function createGeminiClient(apiKey: string) {
  return new GoogleGenerativeAI(apiKey);
}

export function getGeminiModel(
  client: GoogleGenerativeAI,
  modelName: "gemini-2.0-flash-exp" | "gemini-2.5-flash" = "gemini-2.0-flash-exp"
) {
  return client.getGenerativeModel({ model: modelName });
}

export async function generateChatResponse(
  apiKey: string,
  modelName: "gemini-2.0-flash-exp" | "gemini-2.5-flash",
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
) {
  const client = createGeminiClient(apiKey);
  const model = getGeminiModel(client, modelName);

  const chatHistory = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: chatHistory.slice(0, -1),
    systemInstruction: systemPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = await result.response;

  return {
    text: response.text(),
    usage: response.usageMetadata,
  };
}

export async function generateStreamingResponse(
  apiKey: string,
  modelName: "gemini-2.0-flash-exp" | "gemini-2.5-flash",
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
) {
  const client = createGeminiClient(apiKey);
  const model = getGeminiModel(client, modelName);

  const chatHistory = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: chatHistory.slice(0, -1),
    systemInstruction: systemPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  return result.stream;
}
