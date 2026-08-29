import { useState, useEffect, useMemo } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import type { TreeNode } from "./useNotes";

function displayName(fileName: string) {
  return fileName.replace(/\.md$/, "").replace(/-/g, " ");
}

function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#>*_~-]/g, "");
}

// Aplana el árbol y devuelve solo los archivos (notas), con su ruta completa
function flattenFiles(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push(node);
    } else if (node.children) {
      result.push(...flattenFiles(node.children));
    }
  }
  return result;
}

export interface SearchResult extends TreeNode {
  snippet?: string;
}

export function useSearch(tree: TreeNode[], query: string) {
  const [contentIndex, setContentIndex] = useState<Record<string, string>>({});

  const files = useMemo(() => flattenFiles(tree), [tree]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        files.map(async (note) => {
          try {
            const raw = await readTextFile(note.path);
            return [note.path, stripMarkdownSyntax(raw)] as const;
          } catch {
            return [note.path, ""] as const;
          }
        }),
      );
      if (!cancelled) {
        setContentIndex(Object.fromEntries(entries));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [files]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;

    return files
      .map((note) => {
        const title = displayName(note.name).toLowerCase();
        const content = (contentIndex[note.path] ?? "").toLowerCase();

        if (title.includes(q)) {
          return { ...note, snippet: undefined };
        }

        const idx = content.indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 30);
          const snippet =
            (start > 0 ? "…" : "") +
            content.slice(start, idx + q.length + 30).trim() +
            "…";
          return { ...note, snippet };
        }

        return null;
      })
      .filter((n): n is SearchResult => n !== null);
  }, [files, contentIndex, query]);

  return results;
}
