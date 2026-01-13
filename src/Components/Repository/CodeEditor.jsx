import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import { getfileContent, resetFileContent } from "../../features/filecontentSlice.js";
import LoadingState from "../Layout/Loading";
import ErrorState from "../Layout/Error";
const languageFromPath = (path = "") => {
  const ext = path.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
    case "cjs":
    case "mjs":
      return "javascript";
    case "ts":
      return "typescript";
    case "jsx":
      return "javascript";
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "md":
    case "markdown":
      return "markdown";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
    case "sass":
      return "scss";
    case "py":
      return "python";
    case "java":
      return "java";
    case "rb":
      return "ruby";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "php":
      return "php";
    case "cs":
      return "csharp";
    case "cpp":
    case "cc":
    case "cxx":
      return "cpp";
    case "c":
      return "c";
    case "yaml":
    case "yml":
      return "yaml";
    case "toml":
      return "toml";
    case "sh":
    case "bash":
      return "shell";
    default:
      return "plaintext";
  }
};

const CodeEditor = ({ repoId, filePath, refName = "main" }) => {
  const dispatch = useDispatch();
  const { content, status, error } = useSelector((state) => state.filecontent);

  useEffect(() => {
    // reset stale content when switching away
    return () => {
      dispatch(resetFileContent());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!repoId || !filePath) return;
    dispatch(
      getfileContent({
        repoId,
        path: filePath,
        ref: refName,
      })
    );
  }, [dispatch, repoId, filePath, refName]);

  const language = useMemo(() => languageFromPath(filePath), [filePath]);
  const fileName = useMemo(
    () => filePath?.split("/").filter(Boolean).pop() || "File",
    [filePath]
  );

  if (!filePath) {
    return (
      <div className="text-slate-400 text-sm">
        Select a file to view its contents.
      </div>
    );
  }

  if (status === "loading") {
    return (
      <LoadingState />
    );
  }

  if (error) {
    return (
        <ErrorState message={error} />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <svg
            className="w-5 h-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span className="font-semibold">{fileName}</span>
          <span className="text-xs text-slate-500 bg-black/30 px-2 py-0.5 rounded-md">
            {language}
          </span>
        </div>
      </div>

      <div className="border border-indigo-500/20 rounded-lg overflow-hidden">
        <Editor
          height="70vh"
          theme="vs-dark"
          language={language}
          value={content || ""}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            mouseWheelScrollSensitivity: 0.5,
            fastScrollSensitivity: 3,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;