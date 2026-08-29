import { useState, useEffect, useCallback } from "react";
import {
  readDir,
  writeTextFile,
  exists,
  rename,
  remove,
} from "@tauri-apps/plugin-fs";

export interface NoteFile {
  name: string;
  path: string;
}

export function useNotes(vaultPath: string | null) {
  const [notes, setNotes] = useState<NoteFile[]>([]);
  const [loading, setLoading] = useState(true);

  function slugify(title: string): string {
    return title.trim().replace(/\s+/g, "-");
  }

  const loadNotes = useCallback(async () => {
    if (!vaultPath) return;
    setLoading(true);
    try {
      const entries = await readDir(vaultPath);
      const mdFiles = entries
        .filter((entry) => entry.isFile && entry.name?.endsWith(".md"))
        .map((entry) => ({
          name: entry.name!,
          path: `${vaultPath}/${entry.name}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setNotes(mdFiles);
    } catch (err) {
      console.error("Error leyendo el vault:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [vaultPath]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(async (): Promise<string | null> => {
    if (!vaultPath) return null;

    const base = "Sin-titulo";
    let candidate = `${vaultPath}/${base}.md`;
    let counter = 1;

    while (await exists(candidate)) {
      counter += 1;
      candidate = `${vaultPath}/${base}-${counter}.md`;
    }

    await writeTextFile(candidate, "");
    await loadNotes();
    return candidate;
  }, [vaultPath, loadNotes]);

  const renameNote = useCallback(
    async (oldPath: string, newTitle: string): Promise<string | null> => {
      if (!vaultPath) return null;

      const cleanTitle = slugify(newTitle);
      if (!cleanTitle) return oldPath;

      const newPath = `${vaultPath}/${cleanTitle}.md`;
      if (newPath === oldPath) return oldPath;

      if (await exists(newPath)) {
        console.error("Ya existe una nota con ese nombre");
        return oldPath;
      }

      await rename(oldPath, newPath);
      await loadNotes();
      return newPath;
    },
    [vaultPath, loadNotes],
  );

  const deleteNote = useCallback(
    async (path: string) => {
      await remove(path);
      await loadNotes();
    },
    [loadNotes],
  );

  return {
    notes,
    loading,
    reload: loadNotes,
    createNote,
    renameNote,
    deleteNote,
  };
}
