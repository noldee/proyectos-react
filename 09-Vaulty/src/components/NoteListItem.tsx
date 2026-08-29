import { useState, useEffect, useRef } from "react";
import type { NoteFile } from "../hooks/useNotes";

function displayName(fileName: string) {
  return fileName.replace(/\.md$/, "").replace(/-/g, " ");
}

interface NoteListItemProps {
  note: NoteFile;
  active: boolean;
  onSelect: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

export function NoteListItem({
  note,
  active,
  onSelect,
  onRename,
  onDelete,
}: NoteListItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(displayName(note.name));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(displayName(note.name));
  }, [note.name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== displayName(note.name)) {
      onRename(trimmed);
    } else {
      setValue(displayName(note.name));
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(displayName(note.name));
            setEditing(false);
          }
        }}
        className="w-full px-2.5 py-2 rounded-lg text-sm mb-0.5 bg-white border border-neutral-300 outline-none"
      />
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "F2") {
            e.preventDefault();
            setEditing(true);
          }
        }}
        className={`w-full text-left px-2.5 py-2 pr-7 rounded-lg text-sm mb-0.5 truncate transition ${
          active
            ? "bg-neutral-200 text-neutral-900"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        {displayName(note.name)}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`¿Eliminar "${displayName(note.name)}"?`)) {
            onDelete();
          }
        }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition p-1"
        title="Eliminar nota"
      >
        ✕
      </button>
    </div>
  );
}
