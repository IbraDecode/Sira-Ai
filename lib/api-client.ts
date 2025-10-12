import { getAuth } from "firebase/auth";

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Not authenticated");
    }

    const token = await user.getIdToken();

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}
