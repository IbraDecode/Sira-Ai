import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const admin = getFirebaseAdmin();
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie.value, true);

    return NextResponse.json({ 
      authenticated: true,
      uid: decodedClaims.uid
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
