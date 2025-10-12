"use client";

import { useState } from "react";
import { Workspace } from "@/types";
import { Plus, MessageSquare, Settings, LogOut, Trash2, Edit2 } from "lucide-react";

interface WorkspaceSidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onSelectWorkspace: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
  onLogout: () => void;
  user: any;
}

export default function WorkspaceSidebar({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onCreateWorkspace,
  onDeleteWorkspace,
  onRenameWorkspace,
  onLogout,
  user,
}: WorkspaceSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleRename = (workspace: Workspace) => {
    setEditingId(workspace.id);
    setEditingName(workspace.name);
  };

  const saveRename = (workspaceId: string) => {
    if (editingName.trim()) {
      onRenameWorkspace(workspaceId, editingName);
    }
    setEditingId(null);
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white mb-1">SIRA AI</h1>
        <p className="text-xs text-gray-400">by Ibra Decode</p>
      </div>

      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onCreateWorkspace}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <Plus size={18} />
          <span>Workspace Baru</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`group relative mb-2 rounded-lg transition ${
              activeWorkspace?.id === workspace.id
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {editingId === workspace.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => saveRename(workspace.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveRename(workspace.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => onSelectWorkspace(workspace)}
                className="w-full px-3 py-2 text-left text-white flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span className="flex-1 truncate text-sm">{workspace.name}</span>
              </button>
            )}

            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(workspace);
                }}
                className="p-1 hover:bg-gray-500 rounded"
              >
                <Edit2 size={14} className="text-gray-300" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Hapus workspace ini?")) {
                    onDeleteWorkspace(workspace.id);
                  }
                }}
                className="p-1 hover:bg-red-500 rounded"
              >
                <Trash2 size={14} className="text-gray-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || user?.email}
            </p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition">
            <Settings size={16} />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
