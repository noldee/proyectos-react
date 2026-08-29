import { useState, useRef, useEffect } from "react";
import type { TreeNode } from "../hooks/useNotes";
import { NoteListItem } from "./NoteListItem";
import { confirm } from "@tauri-apps/plugin-dialog";

function displayName(name: string) {
  return name.replace(/\.md$/, "").replace(/-/g, " ");
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  onSelect: (path: string) => void;
  onRename: (path: string, newTitle: string) => void;
  onDelete: (path: string) => void;
  onCreateNote: (parentPath: string) => void;
  onCreateFolder: (parentPath: string) => void;
}

export function TreeItem({
  node,
  depth,
  activePath,
  onSelect,
  onRename,
  onDelete,
  onCreateNote,
  onCreateFolder,
}: TreeItemProps) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(displayName(node.name));
  const inputRef = useRef<HTMLInputElement>(null);
  const paddingLeft = 8 + depth * 14;

  useEffect(() => {
    setValue(displayName(node.name));
  }, [node.name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (node.type === "file") {
    return (
      <div style={{ paddingLeft }}>
        <NoteListItem
          note={node}
          active={activePath === node.path}
          onSelect={() => onSelect(node.path)}
          onRename={(newTitle) => onRename(node.path, newTitle)}
          onDelete={() => onDelete(node.path)}
        />
      </div>
    );
  }

  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== displayName(node.name)) {
      onRename(node.path, trimmed);
    } else {
      setValue(displayName(node.name));
    }
  };

  return (
    <div>
      <div
        className="group flex items-center rounded-lg hover:bg-neutral-100 transition"
        style={{ paddingLeft }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setValue(displayName(node.name));
                setEditing(false);
              }
            }}
            className="flex-1 mx-1 my-1 px-1.5 py-1 rounded-md text-sm bg-white border border-neutral-300 outline-none"
          />
        ) : (
          <button
            onClick={() => setOpen(!open)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "F2") {
                e.preventDefault();
                setEditing(true);
              }
            }}
            className="flex-1 flex items-center gap-1.5 px-1 py-1.5 text-sm text-neutral-700 text-left"
          >
            <span className="text-[10px] w-3 text-neutral-400">
              {open ? "▾" : "▸"}
            </span>
            <span>📁</span>
            <span className="truncate">{displayName(node.name)}</span>
          </button>
        )}

        {!editing && (
          <div className="hidden group-hover:flex items-center gap-1 pr-1.5">
            <button
              onClick={() => onCreateNote(node.path)}
              title="Nueva nota aquí"
              className="text-xs text-neutral-400 hover:text-neutral-700 px-1"
            >
              +
            </button>
            <button
              onClick={async () => {
                const yes = await confirm(
                  `¿Eliminar la carpeta "${displayName(node.name)}" y todo su contenido?`,
                  { title: "Eliminar carpeta", kind: "warning" },
                );
                if (yes) onDelete(node.path);
              }}
              title="Eliminar carpeta"
              className="text-xs text-neutral-400 hover:text-red-500 px-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {open && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activePath={activePath}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onCreateNote={onCreateNote}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
