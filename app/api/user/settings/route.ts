import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "@/lib/firebase/client";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = initializeFirebase();
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    
    if (userData.settings?.apiKey) {
      try {
        userData.settings.apiKey = decrypt(userData.settings.apiKey);
      } catch (error) {
        userData.settings.apiKey = "";
      }
    }

    return NextResponse.json({ settings: userData.settings });
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
    const userId = request.headers.get("user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (settings.apiKey) {
      settings.apiKey = encrypt(settings.apiKey);
    }

    const { db } = initializeFirebase();
    await updateDoc(doc(db, "users", userId), {
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
