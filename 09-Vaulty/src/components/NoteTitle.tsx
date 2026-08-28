import { useState, useEffect, useRef } from "react";

interface NoteTitleProps {
  title: string;
  onRename: (newTitle: string) => void;
}

export function NoteTitle({ title, onRename }: NoteTitleProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (value.trim() && value.trim() !== title) {
      onRename(value.trim());
    } else {
      setValue(title);
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
            setValue(title);
            setEditing(false);
          }
        }}
        className="text-xs text-neutral-600 outline-none border-b border-neutral-300 bg-transparent"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-xs text-neutral-400 hover:text-neutral-600 transition text-left"
    >
      {title}
    </button>
  );
}
