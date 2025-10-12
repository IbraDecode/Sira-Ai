import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return unauthorized();
    }

    const admin = getFirebaseAdmin();
    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    if (userData?.settings?.apiKey) {
      try {
        userData.settings.apiKey = decrypt(userData.settings.apiKey);
      } catch (error) {
        userData.settings.apiKey = "";
      }
    }

    return NextResponse.json({ settings: userData?.settings || {} });
  } catch (error: any) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    const { settings } = body;

    if (settings.apiKey) {
      settings.apiKey = encrypt(settings.apiKey);
    }

    const admin = getFirebaseAdmin();
    const db = admin.firestore();
    
    await db.collection("users").doc(userId).update({
      settings,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
