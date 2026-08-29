import { useState, useEffect, useCallback } from "react";
import {
  readDir,
  writeTextFile,
  exists,
  rename,
  remove,
  mkdir,
} from "@tauri-apps/plugin-fs";

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

async function readTree(dirPath: string): Promise<TreeNode[]> {
  const entries = await readDir(dirPath);

  const nodes = await Promise.all(
    entries
      .filter((e) => e.name && !e.name.startsWith("."))
      .map(async (entry): Promise<TreeNode | null> => {
        const fullPath = `${dirPath}/${entry.name}`;
        if (entry.isDirectory) {
          const children = await readTree(fullPath);
          return {
            name: entry.name!,
            path: fullPath,
            type: "folder",
            children,
          };
        }
        if (entry.isFile && entry.name!.endsWith(".md")) {
          return { name: entry.name!, path: fullPath, type: "file" };
        }
        return null;
      }),
  );

  return nodes
    .filter((n): n is TreeNode => n !== null)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1; // carpetas primero
      return a.name.localeCompare(b.name);
    });
}

function slugify(title: string): string {
  return title.trim().replace(/\s+/g, "-");
}

export function useNotes(vaultPath: string | null) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!vaultPath) return;
    setLoading(true);
    try {
      const nodes = await readTree(vaultPath);
      setTree(nodes);
    } catch (err) {
      console.error("Error leyendo el vault:", err);
      setTree([]);
    } finally {
      setLoading(false);
    }
  }, [vaultPath]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(
    async (parentPath?: string): Promise<string | null> => {
      const dir = parentPath ?? vaultPath;
      if (!dir) return null;

      const base = "Sin-titulo";
      let candidate = `${dir}/${base}.md`;
      let counter = 1;
      while (await exists(candidate)) {
        counter += 1;
        candidate = `${dir}/${base}-${counter}.md`;
      }

      await writeTextFile(candidate, "");
      await loadNotes();
      return candidate;
    },
    [vaultPath, loadNotes],
  );

  const createFolder = useCallback(
    async (parentPath?: string): Promise<string | null> => {
      const dir = parentPath ?? vaultPath;
      if (!dir) return null;

      const base = "Nueva-carpeta";
      let candidate = `${dir}/${base}`;
      let counter = 1;
      while (await exists(candidate)) {
        counter += 1;
        candidate = `${dir}/${base}-${counter}`;
      }

      await mkdir(candidate);
      await loadNotes();
      return candidate;
    },
    [vaultPath, loadNotes],
  );

  const renameNote = useCallback(
    async (oldPath: string, newTitle: string): Promise<string | null> => {
      const cleanTitle = slugify(newTitle);
      if (!cleanTitle) return oldPath;

      const parentDir = oldPath.substring(0, oldPath.lastIndexOf("/"));
      const isFolder = !oldPath.endsWith(".md");
      const newPath = isFolder
        ? `${parentDir}/${cleanTitle}`
        : `${parentDir}/${cleanTitle}.md`;

      if (newPath === oldPath) return oldPath;
      if (await exists(newPath)) {
        console.error("Ya existe algo con ese nombre");
        return oldPath;
      }

      await rename(oldPath, newPath);
      await loadNotes();
      return newPath;
    },
    [loadNotes],
  );

  const deleteNote = useCallback(
    async (path: string) => {
      await remove(path, { recursive: true });
      await loadNotes();
    },
    [loadNotes],
  );

  return {
    tree,
    loading,
    reload: loadNotes,
    createNote,
    createFolder,
    renameNote,
    deleteNote,
  };
}
