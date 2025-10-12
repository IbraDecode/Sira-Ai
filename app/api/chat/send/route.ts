import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini/client";
import { DEFAULT_PERSONALITIES } from "@/lib/constants";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { decrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    const { workspaceId, message, model, personality, plugins } = body;

    if (!message || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = getFirebaseAdmin();
    const db = admin.firestore();

    const workspaceDoc = await db.collection("workspaces").doc(workspaceId).get();
    
    if (!workspaceDoc.exists) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const workspaceData = workspaceDoc.data();
    if (workspaceData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You don't own this workspace" },
        { status: 403 }
      );
    }

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();

    let apiKey = process.env.GEMINI_API_KEY;
    
    if (userData?.settings?.apiMode === "custom" && userData?.settings?.apiKey) {
      try {
        apiKey = decrypt(userData.settings.apiKey);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid custom API key. Please update your settings." },
          { status: 400 }
        );
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please contact administrator or set your custom API key in settings." },
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
