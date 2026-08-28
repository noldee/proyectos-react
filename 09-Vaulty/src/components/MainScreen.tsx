import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { useNoteContent } from "../hooks/useNoteContent";
import { NoteTitle } from "./NoteTitle";
import { NoteListItem } from "./NoteListItem";

function displayName(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

interface MainScreenProps {
  vaultPath: string;
}

export function MainScreen({ vaultPath }: MainScreenProps) {
  const { notes, loading, createNote, renameNote } = useNotes(vaultPath);
  const [activePath, setActivePath] = useState<string | null>(null);
  const { content, updateContent, saved } = useNoteContent(activePath);
  const vaultName = vaultPath.split("/").filter(Boolean).pop();

  const handleRename = async (newTitle: string) => {
    if (!activePath) return;
    const newPath = await renameNote(activePath, newTitle);
    if (newPath) setActivePath(newPath);
  };

  return (
    <div className="h-screen flex">
      <div className="w-56 bg-neutral-50 border-r border-neutral-200 flex flex-col">
        <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-900 truncate">
            {vaultName}
          </span>
        </div>

        <div className="px-3.5 pb-2.5">
          <button
            onClick={async () => {
              const path = await createNote();
              if (path) setActivePath(path);
            }}
            className="w-full h-8 rounded-lg border border-neutral-300 text-sm hover:bg-neutral-100 transition"
          >
            + Nueva nota
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {loading && (
            <p className="px-2 py-2 text-xs text-neutral-400">Cargando...</p>
          )}
          {!loading && notes.length === 0 && (
            <p className="px-2 py-2 text-xs text-neutral-400">
              No hay notas todavía.
            </p>
          )}
          {notes.map((note) => (
            <NoteListItem
              key={note.path}
              note={note}
              active={activePath === note.path}
              onSelect={() => setActivePath(note.path)}
              onRename={async (newTitle) => {
                const newPath = await renameNote(note.path, newTitle);
                if (newPath && activePath === note.path) setActivePath(newPath);
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activePath ? (
          <>
            <div className="px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between">
              <NoteTitle
                title={displayName(activePath.split("/").pop() ?? "")}
                onRename={handleRename}
              />
              <span className="text-xs text-neutral-400">
                {saved ? "Guardado" : "Guardando..."}
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              className="flex-1 p-8 text-[15px] leading-relaxed text-neutral-900 outline-none resize-none"
              placeholder="Escribe algo..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-neutral-400">
              Selecciona o crea una nota
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
