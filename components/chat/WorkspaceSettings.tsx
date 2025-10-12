"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "@/lib/firebase/client";
import { Workspace } from "@/types";
import { MODELS, DEFAULT_PERSONALITIES, DEFAULT_PLUGINS } from "@/lib/constants";
import { X } from "lucide-react";

interface WorkspaceSettingsProps {
  workspace: Workspace;
  onClose: () => void;
}

export default function WorkspaceSettings({ workspace, onClose }: WorkspaceSettingsProps) {
  const { db } = initializeFirebase();
  const [model, setModel] = useState(workspace.model);
  const [personality, setPersonality] = useState(workspace.personality);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>(workspace.plugins || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "workspaces", workspace.id), {
        model,
        personality,
        plugins: enabledPlugins,
        updatedAt: new Date().toISOString(),
      });
      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Gagal menyimpan settings");
    } finally {
      setSaving(false);
    }
  };

  const togglePlugin = (pluginId: string) => {
    setEnabledPlugins((prev) =>
      prev.includes(pluginId)
        ? prev.filter((id) => id !== pluginId)
        : [...prev, pluginId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Workspace Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(MODELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name} - {value.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Personality
            </label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DEFAULT_PERSONALITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plugins
            </label>
            <div className="space-y-2">
              {DEFAULT_PLUGINS.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{plugin.icon}</span>
                    <div>
                      <p className="text-white font-medium">{plugin.name}</p>
                      <p className="text-sm text-gray-400">{plugin.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledPlugins.includes(plugin.id)}
                      onChange={() => togglePlugin(plugin.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
