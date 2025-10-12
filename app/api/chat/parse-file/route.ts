import { NextRequest, NextResponse } from "next/server";
import { downloadAndParseFile } from "@/lib/file-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUrl, fileType } = body;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
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
