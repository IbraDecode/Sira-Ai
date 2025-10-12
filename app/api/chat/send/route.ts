import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini/client";
import { DEFAULT_PERSONALITIES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, message, model, personality, plugins } = body;

    if (!message || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GLOBAL_GEMINI_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const personalityData = DEFAULT_PERSONALITIES.find((p) => p.id === personality);
    const systemPrompt = personalityData?.prompt || DEFAULT_PERSONALITIES[0].prompt;

    const messages = [
      { role: "user", content: message }
    ];

    const response = await generateChatResponse(
      apiKey,
      model || "gemini-2.0-flash-exp",
      messages,
      systemPrompt
    );

    return NextResponse.json({
      message: response.text,
      usage: response.usage,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
