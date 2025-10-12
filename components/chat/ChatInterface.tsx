"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { initializeFirebase } from "@/lib/firebase/client";
import { Workspace, Message, FileAttachment } from "@/types";
import { Send, Paperclip, Settings as SettingsIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import WorkspaceSettings from "./WorkspaceSettings";
import FileUpload from "./FileUpload";

interface ChatInterfaceProps {
  workspace: Workspace;
  user: any;
}

export default function ChatInterface({ workspace, user }: ChatInterfaceProps) {
  const { db } = initializeFirebase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("workspaceId", "==", workspace.id),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(messageData);
    });

    return () => unsubscribe();
  }, [workspace.id, db]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        workspaceId: workspace.id,
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace.id,
          message: userMessage,
          model: workspace.model,
          personality: workspace.personality,
          plugins: workspace.plugins,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      await addDoc(collection(db, "messages"), {
        workspaceId: workspace.id,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Chat error:", error);
      alert("Terjadi kesalahan saat mengirim pesan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (file: FileAttachment) => {
    setAttachedFiles([...attachedFiles, file]);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {showSettings && (
        <WorkspaceSettings
          workspace={workspace}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showFileUpload && (
        <FileUpload
          onFileUploaded={handleFileUploaded}
          onClose={() => setShowFileUpload(false)}
        />
      )}
      
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{workspace.name}</h2>
          <p className="text-sm text-gray-400">
            Model: {workspace.model} | Personality: {workspace.personality}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <SettingsIcon className="text-gray-400" size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Mulai percakapan dengan SIRA AI
              </h3>
              <p className="text-gray-400">
                Ketik pesan Anda di bawah untuk memulai chat
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="message-content prose prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-800 rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div key={file.id} className="bg-gray-700 rounded-lg px-3 py-2 flex items-center space-x-2">
                <span className="text-sm text-white">{file.name}</span>
                <button
                  onClick={() => setAttachedFiles(attachedFiles.filter((f) => f.id !== file.id))}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <button
            type="button"
            onClick={() => setShowFileUpload(true)}
            className="p-3 hover:bg-gray-700 rounded-lg transition"
          >
            <Paperclip className="text-gray-400" size={20} />
          </button>

          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ketik pesan Anda di sini..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "200px" }}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Enter untuk kirim | Shift + Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
