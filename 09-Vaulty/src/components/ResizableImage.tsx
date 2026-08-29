import Image from "@tiptap/extension-image";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
}: ReactNodeViewProps) {
  const [resizing, setResizing] = useState<"left" | "right" | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const width = node.attrs.width ?? 400;

  const onMouseDown = (side: "left" | "right") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(side);
    startX.current = e.clientX;
    startWidth.current = wrapperRef.current?.offsetWidth ?? width;
  };

  useEffect(() => {
    if (!resizing) return;

    const onMouseMove = (e: MouseEvent) => {
      const delta =
        resizing === "right"
          ? e.clientX - startX.current
          : startX.current - e.clientX;
      const newWidth = Math.max(
        120,
        Math.min(800, Math.round(startWidth.current + delta * 2)),
      );
      updateAttributes({ width: newWidth });
    };
    const onMouseUp = () => setResizing(null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizing, updateAttributes]);

  return (
    <NodeViewWrapper
      as="div"
      style={{
        display: "inline-block",
        position: "relative",
        width: `${width}px`,
        maxWidth: "100%",
        lineHeight: 0,
        margin: "4px 0",
      }}
      className="group"
    >
      <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            outline: selected ? "2px solid #60a5fa" : "none",
          }}
        />
        <div
          onMouseDown={onMouseDown("left")}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "14px",
            marginLeft: "-7px",
            cursor: "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <div className="w-1 h-10 bg-neutral-900/50 rounded-full" />
        </div>
        <div
          onMouseDown={onMouseDown("right")}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "14px",
            marginRight: "-7px",
            cursor: "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <div className="w-1 h-10 bg-neutral-900/50 rounded-full" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 400,
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
