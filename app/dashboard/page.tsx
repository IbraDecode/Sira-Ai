"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "@/lib/firebase/client";
import ChatInterface from "@/components/chat/ChatInterface";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import { Workspace } from "@/types";
import { generateId } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { auth, db } = initializeFirebase();
  
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "workspaces"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workspaceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workspace[];

      setWorkspaces(workspaceData);

      if (workspaceData.length > 0 && !activeWorkspace) {
        setActiveWorkspace(workspaceData[0]);
      } else if (workspaceData.length === 0) {
        createDefaultWorkspace();
      }
    });

    return () => unsubscribe();
  }, [user, db]);

  const createDefaultWorkspace = async () => {
    if (!user) return;

    const newWorkspace: Omit<Workspace, "id"> = {
      userId: user.uid,
      name: "Workspace Baru",
      model: "gemini-2.0-flash-exp",
      personality: "default",
      plugins: [],
      memory: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "workspaces"), newWorkspace);
    setActiveWorkspace({ id: docRef.id, ...newWorkspace });
  };

  const createWorkspace = async () => {
    if (!user) return;

    const newWorkspace: Omit<Workspace, "id"> = {
      userId: user.uid,
      name: `Workspace ${workspaces.length + 1}`,
      model: "gemini-2.0-flash-exp",
      personality: "default",
      plugins: [],
      memory: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "workspaces"), newWorkspace);
    setActiveWorkspace({ id: docRef.id, ...newWorkspace });
  };

  const deleteWorkspace = async (workspaceId: string) => {
    await deleteDoc(doc(db, "workspaces", workspaceId));
    
    if (activeWorkspace?.id === workspaceId) {
      const remaining = workspaces.filter((w) => w.id !== workspaceId);
      setActiveWorkspace(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const renameWorkspace = async (workspaceId: string, newName: string) => {
    await updateDoc(doc(db, "workspaces", workspaceId), {
      name: newName,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <WorkspaceSidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onCreateWorkspace={createWorkspace}
        onDeleteWorkspace={deleteWorkspace}
        onRenameWorkspace={renameWorkspace}
        onLogout={handleLogout}
        user={user}
      />
      
      <div className="flex-1 flex flex-col">
        {activeWorkspace ? (
          <ChatInterface workspace={activeWorkspace} user={user} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Selamat datang di SIRA AI
              </h2>
              <p className="text-gray-400 mb-6">
                Buat workspace baru untuk memulai chat
              </p>
              <button
                onClick={createWorkspace}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Buat Workspace Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
