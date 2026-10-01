import React, { useRef, useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, List, ListOrdered, Undo, Redo,
  Link, Image, Table, Quote, Minus, Code, Type, RemoveFormatting
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write comprehensive clinical or informational content...',
  minHeight = '320px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || '');

  // Synchronize external value with contentEditable on initial mount or major external reset
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
      setHtmlValue(value || '');
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlValue(html);
      onChange(html);
    }
  };

  const execute = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleFontFamily = (font: string) => {
    execute('fontName', font);
  };

  const handleFontSize = (sizePx: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = sizePx;
    try {
      range.surroundContents(span);
      handleInput();
    } catch {
      execute('fontSize', '4');
    }
  };

  const handleHeading = (tag: string) => {
    if (tag === 'p') {
      execute('formatBlock', '<p>');
    } else {
      execute('formatBlock', `<${tag}>`);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter the link URL (e.g. https://... or /treatments/ivf):');
    if (url) {
      execute('createLink', url);
    }
  };

  const handleImage = () => {
    const url = prompt('Enter image URL or select from uploads:');
    if (url) {
      execute('insertImage', url);
    }
  };

  const handleTable = () => {
    const rows = prompt('Number of rows:', '3') || '3';
    const cols = prompt('Number of columns:', '3') || '3';
    const rCount = parseInt(rows, 10) || 3;
    const cCount = parseInt(cols, 10) || 3;

    let tableHtml = '<table border="1" style="width: 100%; border-collapse: collapse; margin: 16px 0;"><thead><tr>';
    for (let c = 0; c < cCount; c++) {
      tableHtml += `<th style="padding: 8px 12px; background: #e0f3fc; border: 1px solid rgba(22,55,76,0.2);">Header ${c + 1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rCount - 1; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cCount; c++) {
        tableHtml += `<td style="padding: 8px 12px; border: 1px solid rgba(22,55,76,0.2);">Row ${r + 1} Cell ${c + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';

    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlValue(newHtml);
    onChange(newHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
  };

  return (
    <div className="wysiwyg-editor border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#006c93] focus-within:border-transparent transition">
      {/* MS Word style Toolbar */}
      <div className="bg-[#f8fafc] border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Undo / Redo */}
        <div className="flex items-center border-r border-slate-300 pr-1.5 mr-1 gap-0.5">
          <button
            type="button"
            onClick={() => execute('undo')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execute('redo')}
            className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <select
          onChange={(e) => handleHeading(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium focus:outline-none"
          defaultValue="p"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        {/* Font Family */}
        <select
          onChange={(e) => handleFontFamily(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium focus:outline-none"
          defaultValue="DM Sans"
        >
          <option value="DM Sans">DM Sans</option>
          <option value="Manrope">Manrope</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Monospace</option>
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium focus:outline-none"
          defaultValue="16px"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
        </select>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* B I U S */}
        <button
          type="button"
          onClick={() => execute('bold')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4 font-bold" />
        </button>
        <button
          type="button"
          onClick={() => execute('italic')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4 italic" />
        </button>
        <button
          type="button"
          onClick={() => execute('underline')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('strikeThrough')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {/* Text Color & Highlight Color */}
        <label className="flex items-center gap-1 px-1.5 py-1 text-xs cursor-pointer hover:bg-slate-200 rounded">
          <Type className="w-3.5 h-3.5 text-[#bc1169]" />
          <input
            type="color"
            onChange={(e) => execute('foreColor', e.target.value)}
            className="w-4 h-4 border-0 p-0 cursor-pointer rounded overflow-hidden"
            title="Text Color"
          />
        </label>
        <label className="flex items-center gap-1 px-1.5 py-1 text-xs cursor-pointer hover:bg-slate-200 rounded">
          <span className="text-[11px] font-bold bg-yellow-200 px-1 rounded">A</span>
          <input
            type="color"
            defaultValue="#ffff00"
            onChange={(e) => execute('hiliteColor', e.target.value)}
            className="w-4 h-4 border-0 p-0 cursor-pointer rounded overflow-hidden"
            title="Highlight Color"
          />
        </label>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execute('justifyLeft')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('justifyCenter')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('justifyRight')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('justifyFull')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execute('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('insertOrderedList')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Inserts: Table, Link, Image, Quote, HR */}
        <button
          type="button"
          onClick={handleTable}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Insert Table"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleImage}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Insert Image URL"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('formatBlock', '<blockquote>')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Quote Block"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execute('insertHorizontalRule')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execute('removeFormat')}
          className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        {/* Source / HTML toggle */}
        <button
          type="button"
          onClick={() => setShowHtml(!showHtml)}
          className={`ml-auto px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
            showHtml ? 'bg-[#006c93] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          title="Toggle HTML Source"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{showHtml ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {/* Editor Body */}
      {showHtml ? (
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-[var(--ink)] bg-white border border-[rgba(22,55,76,0.15)] focus:outline-none resize-y"
          placeholder="Edit HTML directly..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          style={{ minHeight }}
          className="w-full p-4 focus:outline-none wysiwyg-content leading-relaxed text-slate-800 overflow-y-auto"
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};
