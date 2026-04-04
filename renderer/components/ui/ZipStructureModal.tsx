import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  File,
  FileX,
  Folder,
  FolderOpen,
} from "lucide-react";
import { Modal, useOverlayState } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  entries: string[];
  selectedFile: string;
  loadingFilePath: string | null;
  fileContents: Record<string, string>;
  onSelectFile: (filePath: string) => void;
  onClose: () => void;
};

type TreeNode = {
  name: string;
  path: string;
  isDirectory: boolean;
  children: TreeNode[];
};

const isPreviewableFile = (filePath: string) => {
  const fileName = filePath.split("/").pop() ?? "";
  if (fileName.toLowerCase().startsWith(".git")) {
    return true;
  }
  if (
    fileName.toLowerCase().endsWith(".bat") ||
    fileName.toLowerCase().endsWith(".jar")
  ) {
    return false;
  }
  const extensionIndex = fileName.lastIndexOf(".");
  return extensionIndex > 0 && extensionIndex < fileName.length - 1;
};

const buildTree = (entries: string[]) => {
  const root: TreeNode = {
    name: "",
    path: "",
    isDirectory: true,
    children: [],
  };
  for (const entry of entries) {
    const isDirectoryEntry = entry.endsWith("/");
    const parts = entry.replace(/\/$/, "").split("/").filter(Boolean);
    if (parts.length === 0) {
      continue;
    }
    let current = root;
    const currentParts: string[] = [];
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      currentParts.push(part);
      const isLast = i === parts.length - 1;
      const nextIsDirectory = !isLast || isDirectoryEntry;
      const nextPath = `${currentParts.join("/")}${nextIsDirectory ? "/" : ""}`;
      let node = current.children.find((item) => item.name === part);
      if (!node) {
        node = {
          name: part,
          path: nextPath,
          isDirectory: nextIsDirectory,
          children: [],
        };
        current.children.push(node);
      } else if (nextIsDirectory) {
        node.isDirectory = true;
        node.path = nextPath;
      }
      current = node;
    }
  }
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(root.children);
  return root.children;
};

const collectFolderPaths = (nodes: TreeNode[]): string[] => {
  const paths: string[] = [];
  for (const node of nodes) {
    if (!node.isDirectory) {
      continue;
    }
    paths.push(node.path);
    paths.push(...collectFolderPaths(node.children));
  }
  return paths;
};

export default function ZipStructureModal({
  open,
  entries,
  selectedFile,
  loadingFilePath,
  fileContents,
  onSelectFile,
  onClose,
}: Props) {
  const modalState = useOverlayState({
    isOpen: open,
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        onClose();
      }
    },
  });
  const tree = useMemo(() => buildTree(entries), [entries]);
  const allFolderPaths = useMemo(() => collectFolderPaths(tree), [tree]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    setExpandedFolders(new Set());
  }, [entries]);

  const activeFile = selectedFile || "";
  const activeContent = activeFile ? (fileContents[activeFile] ?? "") : "";
  const isLoadingFile = Boolean(activeFile && loadingFilePath === activeFile);
  const canUseActiveFileActions = Boolean(activeFile && !isLoadingFile);
  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  const handleCopyActiveFile = async () => {
    if (!canUseActiveFileActions) {
      return;
    }
    await navigator.clipboard.writeText(activeContent);
  };
  const handleDownloadActiveFile = () => {
    if (!canUseActiveFileActions) {
      return;
    }
    const blob = new Blob([activeContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.split("/").pop() ?? "file.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal state={modalState}>
      <Modal.Backdrop className="z-9999" isKeyboardDismissDisabled={false}>
        <Modal.Container
          size="cover"
          scroll="inside"
          className="**:no-scrollbar"
        >
          <Modal.Dialog className="rounded-lg border-none">
            <Modal.Header className="flex items-center justify-between">
              <Modal.Heading>ZIP structure preview</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="max-h-[80vh] overflow-y-auto p-3">
              {entries.length === 0 ? (
                <p className="text-sm opacity-70">No files found in ZIP.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
                  <div>
                    <div className="mb-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedFolders(new Set(allFolderPaths))
                        }
                        className="rounded-md bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-800"
                      >
                        Expand all
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedFolders(new Set())}
                        className="rounded-md bg-zinc-200 px-2 py-1 text-xs dark:bg-zinc-800"
                      >
                        Collapse all
                      </button>
                    </div>
                    <div className="max-h-[65vh] overflow-auto rounded-md border p-1 dark:border-zinc-700">
                      {tree.map((node) => {
                        const renderNode = (
                          current: TreeNode,
                          depth: number,
                        ) => {
                          if (current.isDirectory) {
                            const isExpanded = expandedFolders.has(
                              current.path,
                            );
                            return (
                              <div key={current.path}>
                                <button
                                  type="button"
                                  onClick={() => toggleFolder(current.path)}
                                  className="flex w-full items-center gap-1 rounded px-1 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  style={{ paddingLeft: `${depth * 12 + 4}px` }}
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={14} />
                                  ) : (
                                    <ChevronRight size={14} />
                                  )}
                                  {isExpanded ? (
                                    <FolderOpen size={14} />
                                  ) : (
                                    <Folder size={14} />
                                  )}
                                  <span className="font-mono">
                                    {current.name}
                                  </span>
                                </button>
                                {isExpanded &&
                                  current.children.map((child) =>
                                    renderNode(child, depth + 1),
                                  )}
                              </div>
                            );
                          }
                          const disabled = !isPreviewableFile(current.path);
                          return (
                            <button
                              key={current.path}
                              type="button"
                              className={`flex w-full items-center gap-1 rounded px-1 py-1 text-left text-xs ${
                                disabled
                                  ? "cursor-not-allowed opacity-45"
                                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              } ${
                                activeFile === current.path
                                  ? "bg-zinc-200 dark:bg-zinc-800"
                                  : ""
                              }`}
                              style={{ paddingLeft: `${depth * 12 + 22}px` }}
                              onClick={() => {
                                if (!disabled) {
                                  onSelectFile(current.path);
                                }
                              }}
                              disabled={disabled}
                              title={
                                disabled
                                  ? "Preview disabled for .bat, .jar or files without extension"
                                  : current.path
                              }
                            >
                              {disabled ? (
                                <FileX size={14} />
                              ) : (
                                <File size={14} />
                              )}
                              <span className="font-mono">{current.name}</span>
                            </button>
                          );
                        };
                        return renderNode(node, 0);
                      })}
                    </div>
                  </div>
                  <div className="rounded-md border p-2 dark:border-zinc-700">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold">
                        {activeFile || "Select a file"}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-md bg-zinc-200 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800"
                          disabled={!canUseActiveFileActions}
                          onClick={handleCopyActiveFile}
                          title="Copy current file content"
                        >
                          <span className="flex items-center gap-1">
                            <Copy size={12} />
                            Copy
                          </span>
                        </button>
                        <button
                          type="button"
                          className="rounded-md bg-zinc-200 px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800"
                          disabled={!canUseActiveFileActions}
                          onClick={handleDownloadActiveFile}
                          title="Download current file content"
                        >
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            Download
                          </span>
                        </button>
                      </div>
                    </div>
                    <pre className="max-h-[55vh] overflow-auto rounded bg-zinc-100 p-2 text-xs wrap-break-word whitespace-pre-wrap dark:bg-zinc-800 dark:text-white">
                      {isLoadingFile
                        ? "Loading file..."
                        : activeContent || "No preview"}
                    </pre>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.CloseTrigger className="bg-inherit">
              <span className="mr-4 rounded-md bg-zinc-200 px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white">
                Close
              </span>
            </Modal.CloseTrigger>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
