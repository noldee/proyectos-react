import { Node, mergeAttributes, InputRule } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

interface WikiLinkAttrs {
  title: string;
  alias: string | null;
}

function WikiLinkComponent({ node }: NodeViewProps) {
  const { title, alias } = node.attrs as WikiLinkAttrs;
  return (
    <NodeViewWrapper as="span" className="wiki-link" data-title={title}>
      {alias ?? title}
    </NodeViewWrapper>
  );
}

export interface WikiLinkNodeOptions {
  onNavigate: (title: string) => void;
}

export const WikiLinkNode = Node.create<WikiLinkNodeOptions>({
  name: "wikiLink",
  group: "inline",
  inline: true,
  atom: true,

  addOptions() {
    return { onNavigate: () => {} };
  },

  addAttributes() {
    return {
      title: { default: "" },
      alias: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-wiki-link]",
        getAttrs: (el) => ({
          title: (el as HTMLElement).getAttribute("title") ?? "",
          alias: (el as HTMLElement).getAttribute("alias"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-wiki-link": "" }),
      node.attrs.alias ?? node.attrs.title,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkComponent);
  },

  addStorage() {
    return {
      markdown: {
        serialize: (
          state: { write: (s: string) => void },
          node: { attrs: WikiLinkAttrs },
        ) => {
          const { title, alias } = node.attrs;
          state.write(alias ? `[[${title} AS "${alias}"]]` : `[[${title}]]`);
        },
        parse: {},
      },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\[\[([^\]|]+?)(?:\s+AS\s+"([^"]+)")?\]\]$/,
        handler: ({ state, range, match }) => {
          const title = match[1].trim();
          const alias = match[2]?.trim() ?? null;
          const { tr } = state;
          tr.replaceWith(
            range.from,
            range.to,
            this.type.create({ title, alias }),
          );
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    const options = this.options;
    return [
      new Plugin({
        key: new PluginKey("wikiLinkClick"),
        props: {
          handleClickOn: (_view, _pos, node) => {
            if (node.type.name === "wikiLink") {
              options.onNavigate(node.attrs.title);
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
