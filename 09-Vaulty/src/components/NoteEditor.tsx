import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableImage } from "./ResizableImage";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef } from "react";
import { Table } from "@tiptap/extension-table";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

interface NoteEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

const lowlight = createLowlight(common);

export function NoteEditor({ content, onChange }: NoteEditorProps) {
  const lastEmitted = useRef<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({ placeholder: "Escribe algo..." }),
      ResizableImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Markdown.configure({
        html: false,
        transformPastedText: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const markdown = (
        editor.storage as unknown as { markdown: { getMarkdown: () => string } }
      ).markdown.getMarkdown();
      lastEmitted.current = markdown;
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none focus:outline-none min-h-full text-[15px] leading-relaxed",
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        event.preventDefault();
        editor?.commands.insertContent(text);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false; // es solo reordenar contenido dentro del editor

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (imageFiles.length === 0) return false;

        event.preventDefault();

        const coords = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        imageFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: dataUrl, with: 400 });
            const tr = view.state.tr.insert(
              coords?.pos ?? view.state.selection.from,
              node,
            );
            view.dispatch(tr);
          };
          reader.readAsDataURL(file);
        });

        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (content === lastEmitted.current) return;
    queueMicrotask(() => {
      editor.commands.setContent(content);
      lastEmitted.current = content;
    });
  }, [content, editor]);
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <EditorContent editor={editor} />
    </div>
  );
}
