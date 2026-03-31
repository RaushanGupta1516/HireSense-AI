import React, { useRef, useEffect, useCallback } from "react";

// ── TOOLBAR BUTTON ──
function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`w-7 h-7 flex items-center justify-center rounded text-xs font-semibold transition-all ${
        active
          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function TextEditor({
  label, id, value, onChange, placeholder,
  isRequired, aiButton, description,
  handleGenerate, generatingDescription,
}) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  // Sync value into editor when changed externally (e.g. AI generates content)
  useEffect(() => {
    if (!editorRef.current) return;
    const current = editorRef.current.innerHTML;
    if (value !== undefined && value !== current && !isInternalChange.current) {
      editorRef.current.innerHTML = value || "";
    }
    isInternalChange.current = false;
  }, [value]);

  const emit = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange({ target: { name: id, value: editorRef.current.innerHTML } });
  }, [id, onChange]);

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    emit();
  };

  const isActive = (command) => {
    try { return document.queryCommandState(command); } catch { return false; }
  };

  const insertList = (type) => {
    exec(type === "ol" ? "insertOrderedList" : "insertUnorderedList");
  };

  const setHeading = (tag) => {
    exec("formatBlock", tag);
  };

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label} {isRequired && <span className="text-indigo-400">*</span>}
        </label>
        {aiButton && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generatingDescription}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-wait text-white text-xs font-semibold rounded-lg transition-all"
          >
            {generatingDescription ? (
              <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            ) : (
              <><span>✨</span>Generate using AI</>
            )}
          </button>
        )}
      </div>

      {description && <p className="text-xs text-gray-600">{description}</p>}

      {/* Editor container */}
      <div className="border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-white/[0.03] border-b border-white/5">
          {/* Format */}
          <ToolBtn onClick={() => setHeading("h2")} title="Heading 2">H2</ToolBtn>
          <ToolBtn onClick={() => setHeading("h3")} title="Heading 3">H3</ToolBtn>
          <ToolBtn onClick={() => setHeading("p")} title="Paragraph">¶</ToolBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Text style */}
          <ToolBtn onClick={() => exec("bold")} active={isActive("bold")} title="Bold">
            <strong>B</strong>
          </ToolBtn>
          <ToolBtn onClick={() => exec("italic")} active={isActive("italic")} title="Italic">
            <em>I</em>
          </ToolBtn>
          <ToolBtn onClick={() => exec("underline")} active={isActive("underline")} title="Underline">
            <span className="underline">U</span>
          </ToolBtn>
          <ToolBtn onClick={() => exec("strikeThrough")} title="Strikethrough">
            <span className="line-through">S</span>
          </ToolBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Lists */}
          <ToolBtn onClick={() => insertList("ul")} title="Bullet List">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolBtn>
          <ToolBtn onClick={() => insertList("ol")} title="Numbered List">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </ToolBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Indent */}
          <ToolBtn onClick={() => exec("indent")} title="Indent">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7M3 5v14" />
            </svg>
          </ToolBtn>
          <ToolBtn onClick={() => exec("outdent")} title="Outdent">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7M21 5v14" />
            </svg>
          </ToolBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Undo / Redo */}
          <ToolBtn onClick={() => exec("undo")} title="Undo">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </ToolBtn>
          <ToolBtn onClick={() => exec("redo")} title="Redo">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </ToolBtn>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Clear */}
          <ToolBtn onClick={() => exec("removeFormat")} title="Clear Formatting">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </ToolBtn>
        </div>

        {/* Content area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          data-placeholder={placeholder || "Start typing..."}
          className="min-h-[20rem] max-h-[40rem] overflow-y-auto px-5 py-4 text-sm text-gray-200 bg-transparent outline-none
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-4 [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-3 [&_h3]:mb-1.5
            [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-2
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-gray-300
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:text-gray-300
            [&_li]:text-gray-300 [&_strong]:text-white [&_em]:text-gray-400
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600 empty:before:pointer-events-none"
        />
      </div>
    </div>
  );
}

export default TextEditor;