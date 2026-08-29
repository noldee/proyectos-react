import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { useNoteContent } from "../hooks/useNoteContent";
import { NoteTitle } from "./NoteTitle";
import { NoteListItem } from "./NoteListItem";
import { NoteEditor } from "./NoteEditor";

function displayName(fileName: string) {
  return fileName.replace(/\.md$/, "").replace(/-/g, " ");
}

interface MainScreenProps {
  vaultPath: string;
  onExitVault: () => void;
}

export function MainScreen({ vaultPath, onExitVault }: MainScreenProps) {
  const { notes, loading, createNote, renameNote, deleteNote } =
    useNotes(vaultPath);
  const [activePath, setActivePath] = useState<string | null>(null);
  const { content, updateContent, saved } = useNoteContent(activePath);

  // Soporta tanto '/' (macOS/Linux) como '\' (Windows)
  const vaultName = vaultPath.split(/[/\\]/).filter(Boolean).pop();

  const handleRename = async (newTitle: string) => {
    if (!activePath) return;
    const newPath = await renameNote(activePath, newTitle);
    if (newPath) setActivePath(newPath);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar Container */}
      <div className="w-56 bg-neutral-50 border-r border-neutral-200 flex flex-col">
        {/* Header Vault */}
        <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-900 truncate">
            {vaultName}
          </span>
        </div>

        {/* Acción Crear Nota */}
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

        {/* Lista de Notas (Scrollable) */}
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
              onDelete={async () => {
                await deleteNote(note.path);
                if (activePath === note.path) setActivePath(null);
              }}
            />
          ))}
        </div>

        {/* Footer Sidebar (Cambiar Vault) */}
        <div className="px-3.5 py-2.5 border-t border-neutral-200">
          <button
            onClick={onExitVault}
            className="w-full flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-800 transition"
          >
            <span>📁</span>
            Cambiar vault
          </button>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 flex flex-col">
        {activePath ? (
          <>
            <div className="px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between">
              <NoteTitle
                title={displayName(activePath.split(/[/\\]/).pop() ?? "")}
                onRename={handleRename}
              />
              <span className="text-xs text-neutral-400">
                {saved ? "Guardado" : "Guardando..."}
              </span>
            </div>
            <NoteEditor content={content} onChange={updateContent} />
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
