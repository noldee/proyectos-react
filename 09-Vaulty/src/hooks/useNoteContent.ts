import { useState, useEffect, useCallback, useRef } from "react";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export function useNoteContent(notePath: string | null) {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notePath) {
      setContent("");
      return;
    }
    (async () => {
      try {
        const text = await readTextFile(notePath);
        setContent(text);
        setSaved(true);
      } catch (err) {
        console.error("Error leyendo nota:", err);
      }
    })();
  }, [notePath]);

  const updateContent = useCallback(
    (value: string) => {
      setContent(value);
      setSaved(false);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (!notePath) return;
        try {
          await writeTextFile(notePath, value);
          setSaved(true);
        } catch (err) {
          console.error("Error guardando nota:", err);
        }
      }, 500);
    },
    [notePath],
  );

  return { content, updateContent, saved };
}
