import * as pdf from "pdf-parse";
import mammoth from "mammoth";

export async function parseFile(fileBuffer: Buffer, fileType: string): Promise<string> {
  try {
    if (fileType === "application/pdf") {
      const data = await pdf(fileBuffer);
      return data.text;
    }

    if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    }

    if (fileType.startsWith("text/") || fileType === "application/json") {
      return fileBuffer.toString("utf-8");
    }

    if (fileType.startsWith("image/")) {
      return "[Image file uploaded - AI can analyze images in Gemini]";
    }

    return "[Unsupported file type]";
  } catch (error) {
    console.error("File parsing error:", error);
    throw new Error("Failed to parse file");
  }
}

export async function downloadAndParseFile(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "";
    
    return await parseFile(buffer, contentType);
  } catch (error) {
    console.error("Download and parse error:", error);
    throw new Error("Failed to download and parse file");
  }
}
