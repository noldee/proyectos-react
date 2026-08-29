import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import { useNoteContent } from "../hooks/useNoteContent";
import { useSearch } from "../hooks/useSearch";
import { TreeItem } from "./TreeItem";
import { NoteEditor } from "./NoteEditor";

interface MainScreenProps {
  vaultPath: string;
  onExitVault: () => void;
}

export function MainScreen({ vaultPath, onExitVault }: MainScreenProps) {
  const { tree, loading, createNote, createFolder, renameNote, deleteNote } =
    useNotes(vaultPath);
  const [activePath, setActivePath] = useState<string | null>(null);
  const { content, updateContent, saved } = useNoteContent(activePath);
  const vaultName = vaultPath.split("/").filter(Boolean).pop();

  const [search, setSearch] = useState("");
  const filteredNotes = useSearch(tree, search);

  return (
    <div className="h-screen flex">
      <div className="w-56 bg-neutral-50 border-r border-neutral-200 flex flex-col">
        <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-900 truncate">
            {vaultName}
          </span>
        </div>

        <div className="px-3.5 pb-2.5 flex gap-2">
          <button
            onClick={async () => {
              const path = await createNote();
              if (path) setActivePath(path);
            }}
            className="flex-1 h-8 rounded-lg border border-neutral-300 text-xs hover:bg-neutral-100 transition"
          >
            + Nota
          </button>
          <button
            onClick={() => createFolder()}
            className="flex-1 h-8 rounded-lg border border-neutral-300 text-xs hover:bg-neutral-100 transition"
          >
            + Carpeta
          </button>
        </div>

        <div className="px-3.5 pb-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar notas..."
            className="w-full h-8 px-2.5 rounded-lg border border-neutral-300 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {loading && (
            <p className="px-2 py-2 text-xs text-neutral-400">Cargando...</p>
          )}

          {!loading && search.trim() ? (
            <>
              {filteredNotes.length === 0 && (
                <p className="px-2 py-2 text-xs text-neutral-400">
                  No existe esta nota.
                </p>
              )}
              {filteredNotes.map((note) => (
                <div key={note.path}>
                  <button
                    onClick={() => setActivePath(note.path)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm mb-0.5 truncate transition ${
                      activePath === note.path
                        ? "bg-neutral-200 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {note.name.replace(/\.md$/, "").replace(/-/g, " ")}
                  </button>
                  {note.snippet && (
                    <p className="px-2.5 pb-1 text-[11px] text-neutral-400 truncate">
                      {note.snippet}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              {!loading && tree.length === 0 && (
                <p className="px-2 py-2 text-xs text-neutral-400">
                  No hay notas todavía.
                </p>
              )}
              {tree.map((node) => (
                <TreeItem
                  key={node.path}
                  node={node}
                  depth={0}
                  activePath={activePath}
                  onSelect={setActivePath}
                  onRename={async (path, newTitle) => {
                    const newPath = await renameNote(path, newTitle);
                    if (newPath && activePath === path) setActivePath(newPath);
                  }}
                  onDelete={async (path) => {
                    await deleteNote(path);
                    if (activePath === path) setActivePath(null);
                  }}
                  onCreateNote={async (parentPath) => {
                    const path = await createNote(parentPath);
                    if (path) setActivePath(path);
                  }}
                  onCreateFolder={(parentPath) => createFolder(parentPath)}
                />
              ))}
            </>
          )}
        </div>

        <div className="px-3.5 py-2.5 border-t border-neutral-200">
          <button
            onClick={onExitVault}
            className="w-full flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-800 transition"
          >
            📁 Cambiar vault
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activePath ? (
          <>
            <div className="px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {activePath
                  .split("/")
                  .pop()
                  ?.replace(/\.md$/, "")
                  .replace(/-/g, " ")}
              </span>
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
