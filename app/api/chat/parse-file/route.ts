import { NextRequest, NextResponse } from "next/server";
import { downloadAndParseFile } from "@/lib/file-parser";
import { verifyAuth, unauthorized } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    const firebaseStorageDomain = process.env.NEXT_PUBLIC_FIREBASE_B_STORAGE_BUCKET;
    const allowedDomain = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageDomain}`;
    
    if (!fileUrl.startsWith(allowedDomain)) {
      return NextResponse.json(
        { error: "Invalid file URL. Only Firebase Storage URLs are allowed." },
        { status: 403 }
      );
    }

    const content = await downloadAndParseFile(fileUrl);

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("File parse error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse file" },
      { status: 500 }
    );
  }
}
