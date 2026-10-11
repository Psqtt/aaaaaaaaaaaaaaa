"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import {
  CheckSquare,
  Quote,
  Code,
  Minus,
  Lightbulb,
  AlertCircle,
  Calendar,
  ListTodo,
  Sparkles,
} from "lucide-react";

import { useEdgeStore } from "@/lib/edgestore";

// Patch window.ResizeObserver with requestAnimationFrame to prevent notification loops
if (typeof window !== "undefined") {
  const originalRO = window.ResizeObserver;
  if (originalRO && !(originalRO as any).__isPatched) {
    const PatchedRO = class extends originalRO {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          window.requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (err: any) {
              if (
                err?.message?.includes("ResizeObserver loop") ||
                err?.message?.includes("undelivered notifications")
              ) {
                return;
              }
              throw err;
            }
          });
        });
      }
    };
    (PatchedRO as any).__isPatched = true;
    window.ResizeObserver = PatchedRO;
  }

  window.addEventListener("error", (e) => {
    if (
      e.message?.includes("ResizeObserver loop") ||
      e.message?.includes("undelivered notifications")
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

// Patch BlockNoteEditor prototype to handle null block identifiers gracefully
if (BlockNoteEditor && BlockNoteEditor.prototype) {
  const originalGetBlock = BlockNoteEditor.prototype.getBlock;
  BlockNoteEditor.prototype.getBlock = function (t: any) {
    if (!t) return undefined as any;
    try {
      return originalGetBlock.call(this, t);
    } catch {
      return undefined as any;
    }
  };

  const originalSetTextCursorPosition =
    BlockNoteEditor.prototype.setTextCursorPosition;
  if (originalSetTextCursorPosition) {
    BlockNoteEditor.prototype.setTextCursorPosition = function (
      t: any,
      e: any = "start"
    ) {
      if (!t) return;
      try {
        return originalSetTextCursorPosition.call(this, t, e);
      } catch {
        // Safe fallback
      }
    };
  }
}

function insertOrUpdate(editor: BlockNoteEditor, block: any) {
  const currentBlock = editor.getTextCursorPosition().block;
  if (!currentBlock) return;
  const isSlashOnly =
    (currentBlock.content &&
      currentBlock.content.length === 1 &&
      currentBlock.content[0].type === "text" &&
      currentBlock.content[0].text === "/") ||
    (currentBlock.content && currentBlock.content.length === 0);

  if (isSlashOnly) {
    editor.updateBlock(currentBlock, block);
  } else {
    editor.insertBlocks([block], currentBlock, "after");
    const next = editor.getTextCursorPosition().nextBlock;
    if (next) {
      editor.setTextCursorPosition(next);
    }
  }
}

function insertTemplate(editor: BlockNoteEditor, blocks: any[]) {
  const currentBlock = editor.getTextCursorPosition().block;
  if (!currentBlock) return;
  const isSlashOnly =
    (currentBlock.content &&
      currentBlock.content.length === 1 &&
      currentBlock.content[0].type === "text" &&
      currentBlock.content[0].text === "/") ||
    (currentBlock.content && currentBlock.content.length === 0);

  if (isSlashOnly && blocks.length > 0) {
    editor.updateBlock(currentBlock, blocks[0]);
    if (blocks.length > 1) {
      editor.insertBlocks(blocks.slice(1), currentBlock, "after");
    }
  } else {
    editor.insertBlocks(blocks, currentBlock, "after");
  }
}

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const parsedContent = useMemo(() => {
    if (!initialContent) return undefined;
    try {
      const parsed = JSON.parse(initialContent);
      return Array.isArray(parsed) && parsed.length > 0
        ? (parsed as PartialBlock[])
        : undefined;
    } catch {
      return undefined;
    }
  }, [initialContent]);

  // Extended Slash Menu Items with rich block types and templates
  const slashMenuItems = useMemo<ReactSlashMenuItem<any>[]>(() => {
    const defaultItems = getDefaultReactSlashMenuItems();

    const extraItems: ReactSlashMenuItem<any>[] = [
      // Basic Blocks
      {
        name: "Checklist (To-Do)",
        aliases: ["todo", "task", "tarefa", "check", "checkbox", "checklist"],
        group: "Basic blocks",
        icon: <CheckSquare size={18} />,
        hint: "Lista com caixas de seleção para tarefas",
        shortcut: "Ctrl-Alt-C",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            content: [
              { type: "text", text: "☐  ", styles: { bold: true } },
              { type: "text", text: "Nova tarefa a fazer...", styles: {} },
            ],
          });
        },
      },
      {
        name: "Quote (Citação)",
        aliases: ["quote", "citacao", "blockquote", "frase"],
        group: "Basic blocks",
        icon: <Quote size={18} />,
        hint: "Destacar uma citação ou referência em itálico",
        shortcut: "Ctrl-Alt-Q",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            props: {
              backgroundColor: "gray",
            },
            content: [
              {
                type: "text",
                text: "“ Escreva a citação inspiradora aqui... ”",
                styles: { italic: true },
              },
            ],
          });
        },
      },
      {
        name: "Code Block (Código)",
        aliases: ["code", "codigo", "snippet", "pre", "terminal"],
        group: "Basic blocks",
        icon: <Code size={18} />,
        hint: "Trecho de código com formatação monoespaçada",
        shortcut: "Ctrl-Alt-K",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            props: {
              backgroundColor: "gray",
            },
            content: [
              {
                type: "text",
                text: "// Digite ou cole seu trecho de código aqui",
                styles: { code: true },
              },
            ],
          });
        },
      },
      {
        name: "Divider (Separador)",
        aliases: ["divider", "divisor", "hr", "line", "linha", "separador"],
        group: "Basic blocks",
        icon: <Minus size={18} />,
        hint: "Linha horizontal para dividir seções visualmente",
        shortcut: "---",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            props: {
              textColor: "gray",
            },
            content: [
              {
                type: "text",
                text: "────────────────────────────────────────",
                styles: {},
              },
            ],
          });
        },
      },
      // Advanced / Callout Blocks
      {
        name: "Callout (Dica / Info)",
        aliases: ["callout", "info", "dica", "nota", "observacao", "alert"],
        group: "Advanced blocks",
        icon: <Lightbulb size={18} />,
        hint: "Caixa destacada com fundo colorido para observações",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            props: {
              backgroundColor: "blue",
            },
            content: [
              { type: "text", text: "💡 Dica: ", styles: { bold: true } },
              {
                type: "text",
                text: "Adicione sua observação importante ou recomendação aqui.",
                styles: {},
              },
            ],
          });
        },
      },
      {
        name: "Callout (Aviso / Alerta)",
        aliases: ["warning", "aviso", "alerta", "danger", "perigo", "cuidado"],
        group: "Advanced blocks",
        icon: <AlertCircle size={18} />,
        hint: "Caixa destacada em tom de alerta para pontos críticos",
        execute: (editor) => {
          insertOrUpdate(editor, {
            type: "paragraph",
            props: {
              backgroundColor: "red",
            },
            content: [
              { type: "text", text: "⚠️ Atenção: ", styles: { bold: true } },
              {
                type: "text",
                text: "Informação crítica ou aviso importante que requer cautela.",
                styles: {},
              },
            ],
          });
        },
      },
      {
        name: "Data e Hora Atual",
        aliases: ["today", "date", "hoje", "data", "now", "hora", "timestamp"],
        group: "Advanced blocks",
        icon: <Calendar size={18} />,
        hint: "Inserir carimbo de data e hora do momento",
        execute: (editor) => {
          const now = new Date();
          const formatted = now.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          insertOrUpdate(editor, {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `📅 ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`,
                styles: { bold: true },
              },
            ],
          });
        },
      },
      // Templates
      {
        name: "Modelo: Reunião / Pauta",
        aliases: ["meeting", "reuniao", "pauta", "ata", "template", "agenda"],
        group: "Templates",
        icon: <ListTodo size={18} />,
        hint: "Estrutura pronta para ata de reunião, pautas e decisões",
        execute: (editor) => {
          const today = new Date().toLocaleDateString("pt-BR");
          insertTemplate(editor, [
            {
              type: "heading",
              props: { level: 2 },
              content: [
                {
                  type: "text",
                  text: `📋 Reunião de Alinhamento (${today})`,
                  styles: {},
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "👥 Participantes: ",
                  styles: { bold: true },
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "🎯 Objetivos da Reunião: ",
                  styles: { bold: true },
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "💬 Principais Decisões Tomadas: ",
                  styles: { bold: true },
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "✅ Próximos Passos e Responsáveis: ",
                  styles: { bold: true },
                },
              ],
            },
          ]);
        },
      },
      {
        name: "Modelo: Plano de Projeto",
        aliases: ["project", "projeto", "brief", "plano", "roadmap", "escopo"],
        group: "Templates",
        icon: <Sparkles size={18} />,
        hint: "Visão geral, resumo, metas e fases de entrega",
        execute: (editor) => {
          insertTemplate(editor, [
            {
              type: "heading",
              props: { level: 2 },
              content: [
                {
                  type: "text",
                  text: "🚀 Visão Geral do Projeto",
                  styles: {},
                },
              ],
            },
            {
              type: "paragraph",
              props: { backgroundColor: "yellow" },
              content: [
                { type: "text", text: "📌 Resumo: ", styles: { bold: true } },
                {
                  type: "text",
                  text: "Descreva brevemente o propósito e valor deste projeto.",
                  styles: {},
                },
              ],
            },
            {
              type: "heading",
              props: { level: 3 },
              content: [
                {
                  type: "text",
                  text: "Fases e Entregáveis",
                  styles: {},
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "Fase 1: Especificação e Planejamento",
                  styles: {},
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "Fase 2: Desenvolvimento e Execução",
                  styles: {},
                },
              ],
            },
            {
              type: "bulletListItem",
              content: [
                {
                  type: "text",
                  text: "Fase 3: Revisão e Lançamento",
                  styles: {},
                },
              ],
            },
          ]);
        },
      },
    ];

    return [...defaultItems, ...extraItems];
  }, []);

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: parsedContent,
    slashMenuItems,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
