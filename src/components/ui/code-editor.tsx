"use client";

import { useState, useMemo, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";

// ---- Language packs (static imports for speed) ----
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import {
  HighlightStyle,
  syntaxHighlighting as _syntaxHighlighting,
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// ⚙️ Optional: C# and Kotlin (add only if needed)
// import { csharp } from "@replit/codemirror-lang-csharp";
// import { StreamLanguage } from "@codemirror/language";
// import { clike } from "@codemirror/legacy-modes/mode/clike";

type Props = {
  language: string; // Judge0 name (e.g. "C (GCC 13.2.0)")
  initial?: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  minHeight?: number;
  theme?: "light" | "dark";
  ariaLabel?: string;
  className?: string;
};

// 🔹 Judge0 → CodeMirror normalization
const normalizeJudge0 = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.startsWith("c++")) return "cpp";
  if (lower.startsWith("c ")) return "c";
  if (lower.startsWith("java")) return "java";
  if (lower.startsWith("python")) return "python";
  if (lower.startsWith("javascript")) return "javascript";
  if (lower.startsWith("typescript")) return "typescript";
  if (lower.startsWith("go")) return "go";
  if (lower.startsWith("rust")) return "rust";
  if (lower.startsWith("kotlin")) return "kotlin";
  if (lower.startsWith("c#")) return "csharp";
  if (lower.startsWith("sql")) return "sql";
  if (lower.startsWith("html")) return "html";
  if (lower.startsWith("css")) return "css";
  if (lower.startsWith("markdown")) return "markdown";
  return "plaintext";
};

// 🔹 Pre-loaded language extensions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LANG_MAP: Record<string, any> = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ typescript: true }),
  python: python(),
  java: java(),
  c: cpp(),
  cpp: cpp(),
  go: go(),
  rust: rust(),
  sql: sql(),
  html: html(),
  css: css(),
  markdown: markdown(),
  // csharp: csharp(), // optional
  // kotlin: StreamLanguage.define(clike),
};

// 🔹 LeetCode-style theme with proper syntax highlighting
const cmTheme = (mode: "light" | "dark") =>
  EditorView.theme(
    mode === "dark"
      ? {
          "&": {
            backgroundColor: "#1a1d23",
            color: "#abb2bf",
          },
          ".cm-content": {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: "14px",
            caretColor: "#528bff",
          },
          ".cm-gutters": {
            backgroundColor: "#1a1d23",
            color: "#4b5263",
            border: "none",
            paddingRight: "8px",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent",
            color: "#abb2bf",
          },
          ".cm-activeLine": {
            backgroundColor: "#282c34",
          },
          ".cm-lineNumbers .cm-gutterElement": {
            minWidth: "32px",
            textAlign: "right",
            paddingRight: "8px",
          },
          ".cm-line": {
            paddingLeft: "4px",
          },
          ".cm-selectionBackground, ::selection": {
            backgroundColor: "#3e4451 !important",
          },
          ".cm-focused .cm-selectionBackground, .cm-focused ::selection": {
            backgroundColor: "#3e4451 !important",
          },
          ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: "#528bff",
          },
          ".cm-matchingBracket": {
            backgroundColor: "#3e4451",
            outline: "1px solid #528bff",
          },
          ".cm-nonmatchingBracket": {
            backgroundColor: "transparent",
            outline: "1px solid #e06c75",
          },
        }
      : {
          "&": {
            backgroundColor: "#ffffff",
            color: "#383a42",
          },
          ".cm-content": {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: "14px",
            caretColor: "#526fff",
          },
          ".cm-gutters": {
            backgroundColor: "#fafafa",
            color: "#9d9d9f",
            border: "none",
            paddingRight: "8px",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "transparent",
            color: "#383a42",
          },
          ".cm-activeLine": {
            backgroundColor: "#f0f0f0",
          },
          ".cm-lineNumbers .cm-gutterElement": {
            minWidth: "32px",
            textAlign: "right",
            paddingRight: "8px",
          },
          ".cm-line": {
            paddingLeft: "4px",
          },
          ".cm-selectionBackground, ::selection": {
            backgroundColor: "#d7d4f0 !important",
          },
          ".cm-focused .cm-selectionBackground, .cm-focused ::selection": {
            backgroundColor: "#d7d4f0 !important",
          },
          ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: "#526fff",
          },
          ".cm-matchingBracket": {
            backgroundColor: "#d7d4f0",
            outline: "1px solid #526fff",
          },
          ".cm-nonmatchingBracket": {
            backgroundColor: "transparent",
            outline: "1px solid #e45649",
          },
        },
    { dark: mode === "dark" },
  );

const _darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#c678dd" },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: "#e06c75",
  },
  { tag: [t.function(t.variableName), t.labelName], color: "#61afef" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#d19a66" },
  { tag: [t.definition(t.name), t.separator], color: "#abb2bf" },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: "#d19a66",
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: "#56b6c2",
  },
  { tag: [t.meta, t.comment], color: "#5c6370", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#56b6c2", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#e06c75" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#d19a66" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#98c379" },
  { tag: t.invalid, color: "#e06c75" },
]);

const _lightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#a626a4" },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: "#e45649",
  },
  { tag: [t.function(t.variableName), t.labelName], color: "#4078f2" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#c18401" },
  { tag: [t.definition(t.name), t.separator], color: "#383a42" },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: "#c18401",
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: "#0184bc",
  },
  { tag: [t.meta, t.comment], color: "#a0a1a7", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#0184bc", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#e45649" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#c18401" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#50a14f" },
  { tag: t.invalid, color: "#e45649" },
]);
export default function CodeEditor({
  language,
  initial = "",
  onChange,
  readOnly = false,
  minHeight = 160,
  theme = "dark",
  ariaLabel,
  className = "",
}: Props) {
  const [code, setCode] = useState(initial);

  useEffect(() => setCode(initial), [initial]);

  const ext = useMemo(() => {
    const norm = normalizeJudge0(language);
    return LANG_MAP[norm] || [];
  }, [language]);

  const extensions = useMemo(
    () => [
      basicSetup,
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      indentUnit.of("  "),
      cmTheme(theme),
      EditorView.theme({ "&": { minHeight: `${minHeight}px` } }),
      ext,
    ],
    [ext, theme, minHeight],
  );

  return (
    <div className={`rounded-xl border ${className}`}>
      <CodeMirror
        value={code}
        onChange={(val) => {
          setCode(val);
          onChange?.(val);
        }}
        editable={!readOnly}
        basicSetup={false}
        extensions={extensions}
        aria-label={ariaLabel || `Code editor (${language})`}
      />
    </div>
  );
}
