import { NextRequest } from "next/server";
import { getFirebaseAdmin } from "./firebase/admin";

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    const admin = getFirebaseAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    return decodedToken.uid;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export function unauthorized() {
  return Response.json(
    { error: "Unauthorized - Invalid or missing authentication" },
    { status: 401 }
  );
}
