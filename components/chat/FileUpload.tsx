"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/lib/firebase/client";
import { FileAttachment } from "@/types";
import { Upload, X, File } from "lucide-react";

interface FileUploadProps {
  onFileUploaded: (file: FileAttachment) => void;
  onClose: () => void;
}

export default function FileUpload({ onFileUploaded, onClose }: FileUploadProps) {
  const { storage } = initializeFirebase();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const fileAttachment: FileAttachment = {
        id: `${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        uploadedAt: new Date().toISOString(),
      };

      onFileUploaded(fileAttachment);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upload File</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
        >
          {uploading ? (
            <div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Uploading...</p>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-white mb-2">Drag & drop file atau</p>
              <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
                Pilih File
                <input
                  type="file"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  accept=".txt,.pdf,.docx,.csv,.json,.jpg,.jpeg,.png"
                />
              </label>
              <p className="text-sm text-gray-400 mt-3">
                Supported: TXT, PDF, DOCX, CSV, JSON, Images
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
