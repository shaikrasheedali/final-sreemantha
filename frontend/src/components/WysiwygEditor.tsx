import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, List, ListOrdered, Undo, Redo,
  Link as LinkIcon, Image as ImageIcon, Table, Quote, Minus, Code, Type,
  RemoveFormatting, X, Check, Upload
} from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';

interface WysiwygEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type BlockTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
type ToolbarDialog = 'link' | 'image' | 'table' | null;
type AlignValue = 'left' | 'center' | 'right' | 'justify';

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  align: AlignValue;
  block: BlockTag;
}

const INITIAL_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  unorderedList: false,
  orderedList: false,
  align: 'left',
  block: 'p',
};

const FONT_FAMILIES = ['DM Sans', 'Manrope', 'Georgia', 'Arial', 'Courier New'];
const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px'];

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeLinkUrl = (raw: string): string => {
  const value = raw.trim();
  if (!value) return '';
  if (/^(javascript|vbscript|data):/i.test(value)) return '';
  if (/^(https?:|mailto:|tel:|sms:|#|\/)/i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '';
  return `https://${value}`;
};

const normalizeMediaUrl = (raw: string): string => {
  const value = raw.trim();
  if (!value) return '';
  if (/^(javascript|vbscript|data):/i.test(value)) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('//')) return value;
  if (value.startsWith('/')) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '';
  return `https://${value}`;
};

const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i.test(url) || /\/video[-_]/i.test(url);

const safeQueryCommandState = (command: string): boolean => {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
};

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write comprehensive clinical or informational content...',
  minHeight = '320px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastValueRef = useRef<string | null>(null);

  const [showHtml, setShowHtml] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || '');
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>(INITIAL_FORMATS);

  const [dialog, setDialog] = useState<ToolbarDialog>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [linkForm, setLinkForm] = useState({
    url: '',
    text: '',
    newTab: false,
    editing: false,
    error: '',
  });
  const [imageForm, setImageForm] = useState({ url: '', alt: '', error: '' });
  const [tableForm, setTableForm] = useState({ rows: 3, cols: 3, header: true });

  /* ------------------------------------------------------------------ */
  /* Selection bookkeeping                                              */
  /* ------------------------------------------------------------------ */

  const saveSelection = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }, []);

  const ensureEditorSelection = useCallback((): Range | null => {
    const editor = editorRef.current;
    if (!editor) return null;

    editor.focus({ preventScroll: true });
    const selection = window.getSelection();
    if (!selection) return null;

    const saved = savedRangeRef.current;
    if (saved && editor.contains(saved.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(saved);
      return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    }

    if (
      selection.rangeCount === 0 ||
      !selection.anchorNode ||
      !editor.contains(selection.anchorNode)
    ) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }, []);

  const getSelectedBlock = useCallback((): HTMLElement | null => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || !selection.anchorNode) return null;
    if (!editor.contains(selection.anchorNode)) return null;

    let node: Node | null = selection.anchorNode;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    while (node && node !== editor) {
      if (
        node instanceof HTMLElement &&
        /^(P|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|PRE|LI)$/.test(node.tagName)
      ) {
        return node;
      }
      node = node.parentElement;
    }

    return null;
  }, []);

  const getSelectedAnchor = useCallback((): HTMLAnchorElement | null => {
    const selection = window.getSelection();
    if (!selection) return null;

    const nodes = [selection.anchorNode, selection.focusNode].filter(Boolean) as Node[];
    for (const node of nodes) {
      const element =
        node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
      const anchor = element?.closest?.('a[href]');
      if (anchor instanceof HTMLAnchorElement) return anchor;
    }

    return null;
  }, []);

  const updateActiveFormats = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || !selection.anchorNode) return;
    if (!editor.contains(selection.anchorNode)) return;

    const blockElement = getSelectedBlock();
    const rawBlock = (blockElement?.tagName || 'p').toLowerCase();
    const block: BlockTag = /^(h1|h2|h3|h4|p|blockquote)$/.test(rawBlock)
      ? (rawBlock as BlockTag)
      : 'p';

    const align: AlignValue = safeQueryCommandState('justifyCenter')
      ? 'center'
      : safeQueryCommandState('justifyRight')
        ? 'right'
        : safeQueryCommandState('justifyFull')
          ? 'justify'
          : 'left';

    const next: ActiveFormats = {
      bold: safeQueryCommandState('bold'),
      italic: safeQueryCommandState('italic'),
      underline: safeQueryCommandState('underline'),
      strike: safeQueryCommandState('strikeThrough'),
      unorderedList: safeQueryCommandState('insertUnorderedList'),
      orderedList: safeQueryCommandState('insertOrderedList'),
      align,
      block,
    };

    setActiveFormats((previous) => {
      if (
        previous.bold === next.bold &&
        previous.italic === next.italic &&
        previous.underline === next.underline &&
        previous.strike === next.strike &&
        previous.unorderedList === next.unorderedList &&
        previous.orderedList === next.orderedList &&
        previous.align === next.align &&
        previous.block === next.block
      ) {
        return previous;
      }
      return next;
    });
  }, [getSelectedBlock]);

  const cleanupPlaceholderSpans = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.querySelectorAll('span[data-wysiwyg-placeholder="true"]').forEach((span) => {
      const text = (span.textContent || '').replace(/\u200B/g, '');
      if (text.length > 0) {
        span.removeAttribute('data-wysiwyg-placeholder');
      }
    });
  }, []);

  const syncFromEditor = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const html = editor.innerHTML;
    lastValueRef.current = html;
    onChange(html);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  /* ------------------------------------------------------------------ */
  /* External value synchronisation                                     */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const nextValue = value || '';

    const editor = editorRef.current;
    if (!editor || showHtml) return;

    // Ignore the echo of edits this editor just emitted. React state updates
    // must never rewrite contentEditable's DOM while the user is typing or
    // while the native undo stack is active. The extra DOM comparison also
    // restores the value when returning from HTML source mode, where the
    // contentEditable element is freshly mounted and therefore empty.
    if (lastValueRef.current === nextValue && editor.innerHTML === nextValue) return;

    lastValueRef.current = nextValue;
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
      savedRangeRef.current = null;
    }
  }, [value, showHtml]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (!editor || !selection || !selection.anchorNode) return;
      if (!editor.contains(selection.anchorNode)) return;

      if (selection.rangeCount > 0) {
        savedRangeRef.current = selection.getRangeAt(0).cloneRange();
      }
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveFormats]);

  useEffect(() => {
    if (!dialog) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDialog(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [dialog]);

  /* ------------------------------------------------------------------ */
  /* Core command execution                                             */
  /* ------------------------------------------------------------------ */

  const execute = useCallback(
    (command: string, commandValue?: string) => {
      if (showHtml) return;

      const editor = editorRef.current;
      if (!editor) return;

      ensureEditorSelection();

      try {
        // Inline CSS gives us real font families, pixel sizes and colours
        // instead of legacy <font> presentation attributes.
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand(command, false, commandValue);
      } catch (error) {
        console.error(`WYSIWYG command failed: ${command}`, error);
      }

      syncFromEditor();
      saveSelection();
    },
    [ensureEditorSelection, saveSelection, showHtml, syncFromEditor]
  );

  const handleInput = () => {
    cleanupPlaceholderSpans();
    syncFromEditor();
    saveSelection();
  };

  const handleEditorBlur = () => {
    saveSelection();

    const editor = editorRef.current;
    if (!editor) return;

    let changed = false;
    editor.querySelectorAll('span[data-wysiwyg-placeholder="true"]').forEach((span) => {
      if (!(span.textContent || '').replace(/\u200B/g, '')) {
        span.remove();
        changed = true;
      }
    });

    if (changed) {
      lastValueRef.current = editor.innerHTML;
      setHtmlValue(editor.innerHTML);
      onChange(editor.innerHTML);
    }
  };

  const setBlockFormat = (tag: BlockTag) => {
    execute('formatBlock', `<${tag}>`);
  };

  const handleHeadingChange = (tag: BlockTag) => {
    setBlockFormat(tag);
  };

  const handleQuoteToggle = () => {
    setBlockFormat(activeFormats.block === 'blockquote' ? 'p' : 'blockquote');
  };

  const applyFontFamily = (font: string) => {
    if (!font) return;
    execute('fontName', font);
  };

  const applyFontSize = (size: string) => {
    if (!size) return;

    const range = ensureEditorSelection();
    const editor = editorRef.current;
    if (!range || !editor) return;

    try {
      if (range.collapsed) {
        // execCommand's legacy fontSize command only exposes 1-7 sizes. For a
        // collapsed caret we insert an invisible placeholder span with the
        // exact pixel size, so the next typed characters inherit it.
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.setAttribute('data-wysiwyg-placeholder', 'true');

        const marker = document.createTextNode('\u200B');
        span.appendChild(marker);
        range.insertNode(span);

        const nextRange = document.createRange();
        nextRange.setStartAfter(marker);
        nextRange.collapse(true);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(nextRange);
          savedRangeRef.current = nextRange.cloneRange();
        }

        syncFromEditor();
        return;
      }

      // Remember any pre-existing xxx-large spans so we only convert the
      // wrappers created by this individual command.
      const existing = new Set<Element>();
      editor.querySelectorAll('font, span').forEach((element) => {
        if (
          element.tagName === 'FONT' ||
          /xxx-large/i.test((element as HTMLElement).style?.fontSize || '')
        ) {
          existing.add(element);
        }
      });

      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('fontSize', false, '7');

      editor.querySelectorAll('font[size="7"]').forEach((fontElement) => {
        if (existing.has(fontElement)) return;
        const span = document.createElement('span');
        span.style.fontSize = size;
        while (fontElement.firstChild) {
          span.appendChild(fontElement.firstChild);
        }
        fontElement.replaceWith(span);
      });

      editor.querySelectorAll('span').forEach((span) => {
        if (existing.has(span)) return;
        if (/xxx-large/i.test(span.style.fontSize || '')) {
          span.style.fontSize = size;
        }
      });

      syncFromEditor();
      saveSelection();
    } catch (error) {
      console.error('WYSIWYG font size failed:', error);
    }
  };

  const clearFormatting = () => {
    execute('removeFormat');
  };

  const toggleSource = () => {
    if (!showHtml) {
      const editor = editorRef.current;
      if (editor) {
        const html = editor.innerHTML;
        lastValueRef.current = html;
        setHtmlValue(html);
        if (html !== (value || '')) {
          onChange(html);
        }
      }
      setShowHtml(true);
      return;
    }

    if (editorRef.current) {
      editorRef.current.innerHTML = htmlValue;
    }
    lastValueRef.current = htmlValue;
    setShowHtml(false);
  };

  const handleHtmlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    lastValueRef.current = nextValue;
    setHtmlValue(nextValue);
    onChange(nextValue);
  };

  /* ------------------------------------------------------------------ */
  /* Link, image and table dialogs                                      */
  /* ------------------------------------------------------------------ */

  const closeDialog = () => {
    setDialog(null);
    window.setTimeout(() => {
      if (!showHtml) ensureEditorSelection();
    }, 0);
  };

  const openLinkDialog = () => {
    saveSelection();
    const anchor = getSelectedAnchor();
    const selectionText = window.getSelection()?.toString() || '';
    const href = anchor?.getAttribute('href') || '';
    const hasExternalTarget = anchor?.getAttribute('target') === '_blank';

    setLinkForm({
      url: href,
      text: selectionText,
      newTab: anchor ? hasExternalTarget : !/^(\/|#|mailto:|tel:)/i.test(href),
      editing: Boolean(anchor),
      error: '',
    });
    setDialog('link');
  };

  const applyLink = () => {
    const normalizedUrl = normalizeLinkUrl(linkForm.url);
    if (!normalizedUrl) {
      setLinkForm((previous) => ({
        ...previous,
        error: 'Enter a valid web address (https://, /relative-path, #anchor, mailto: or tel:).',
      }));
      return;
    }

    ensureEditorSelection();

    if (linkForm.editing) {
      const anchor = getSelectedAnchor();
      if (anchor) {
        anchor.setAttribute('href', normalizedUrl);
        if (linkForm.newTab) {
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noopener noreferrer');
        } else {
          anchor.removeAttribute('target');
          anchor.removeAttribute('rel');
        }
        syncFromEditor();
        saveSelection();
        closeDialog();
        return;
      }
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const linkText = (linkForm.text || selectedText || normalizedUrl).trim();
    const targetAttributes = linkForm.newTab
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';

    if (selection && selectedText.trim() && linkText === selectedText.trim()) {
      document.execCommand('createLink', false, normalizedUrl);
      const anchor = getSelectedAnchor();
      if (anchor) {
        if (linkForm.newTab) {
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noopener noreferrer');
        } else {
          anchor.removeAttribute('target');
          anchor.removeAttribute('rel');
        }
      }
    } else {
      const html = `<a href="${escapeHtml(normalizedUrl)}"${targetAttributes}>${escapeHtml(linkText)}</a>`;
      document.execCommand('insertHTML', false, html);
    }

    syncFromEditor();
    saveSelection();
    closeDialog();
  };

  const removeLink = () => {
    ensureEditorSelection();
    const anchor = getSelectedAnchor();
    if (anchor) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(anchor);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      document.execCommand('unlink', false);
      syncFromEditor();
    }
    closeDialog();
  };

  const openImageDialog = () => {
    saveSelection();
    setImageForm({ url: '', alt: '', error: '' });
    setDialog('image');
  };

  const insertMediaHtml = (url: string, alt = '') => {
    const normalizedUrl = normalizeMediaUrl(url);
    if (!normalizedUrl) return false;

    ensureEditorSelection();
    const html = isVideoUrl(normalizedUrl)
      ? `<video src="${escapeHtml(normalizedUrl)}" controls playsinline preload="metadata"></video>`
      : `<img src="${escapeHtml(normalizedUrl)}" alt="${escapeHtml(alt)}" />`;

    document.execCommand('insertHTML', false, html);
    syncFromEditor();
    saveSelection();
    return true;
  };

  const applyImage = () => {
    const normalizedUrl = normalizeMediaUrl(imageForm.url);
    if (!normalizedUrl) {
      setImageForm((previous) => ({
        ...previous,
        error: 'Enter a valid image or video URL, or choose an asset from the media library.',
      }));
      return;
    }

    if (insertMediaHtml(normalizedUrl, imageForm.alt)) {
      closeDialog();
    }
  };

  const openMediaLibrary = () => {
    setDialog(null);
    setIsPickerOpen(true);
  };

  const applyTable = () => {
    const rows = Math.min(30, Math.max(1, Math.trunc(Number(tableForm.rows) || 1)));
    const cols = Math.min(12, Math.max(1, Math.trunc(Number(tableForm.cols) || 1)));

    ensureEditorSelection();

    let html = '<table>';
    if (tableForm.header) {
      html += '<thead><tr>';
      for (let col = 0; col < cols; col++) {
        html += '<th><br></th>';
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    for (let row = 0; row < rows; row++) {
      html += '<tr>';
      for (let col = 0; col < cols; col++) {
        html += '<td><br></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';

    document.execCommand('insertHTML', false, html);
    syncFromEditor();
    saveSelection();
    closeDialog();
  };

  const focusCell = (cell: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(cell);
    range.collapse(true);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      savedRangeRef.current = range.cloneRange();
    }
    cell.focus({ preventScroll: true });
  };

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase())) {
        window.setTimeout(syncFromEditor, 0);
      }
      return;
    }

    const selection = window.getSelection();
    let node: Node | null = selection?.anchorNode || null;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;

    const cell =
      node instanceof HTMLElement ? (node.closest('th,td') as HTMLTableCellElement | null) : null;
    if (!cell) return;

    const table = cell.closest('table');
    if (!table) return;

    event.preventDefault();
    const cells = Array.from(table.querySelectorAll<HTMLElement>('th,td'));
    const index = cells.indexOf(cell);
    const nextCell = cells[index + (event.shiftKey ? -1 : 1)];

    if (nextCell) {
      focusCell(nextCell);
      return;
    }

    if (!event.shiftKey) {
      const tbody = table.tBodies[0];
      if (!tbody) return;
      const columnCount = table.querySelector('tr')?.children.length || 1;
      const newRow = tbody.insertRow();
      for (let col = 0; col < columnCount; col++) {
        const newCell = newRow.insertCell();
        newCell.innerHTML = '<br>';
      }
      syncFromEditor();
      focusCell(newRow.cells[0] as HTMLElement);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Toolbar helpers                                                    */
  /* ------------------------------------------------------------------ */

  const buttonClass = (isActive = false) =>
    `p-1.5 rounded transition-colors cursor-pointer ${
      isActive
        ? 'bg-[#006c93] text-white shadow-xs'
        : 'text-slate-700 hover:bg-slate-200'
    }`;

  const alignmentButtonClass = (alignment: AlignValue) =>
    buttonClass(activeFormats.align === alignment);

  const selectClass =
    'text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#006c93]';

  return (
    <div className="wysiwyg-editor relative border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#006c93] focus-within:border-transparent transition">
      {/* MS Word style Toolbar */}
      <div
        className="wysiwyg-toolbar bg-[#f8fafc] border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700"
        onMouseDown={saveSelection}
      >
        {showHtml ? (
          <span className="text-[11px] text-[#5a7d92] font-medium px-1">
            HTML source mode — switch to Visual to use formatting tools.
          </span>
        ) : (
          <>
            {/* Undo / Redo */}
            <div className="flex items-center border-r border-slate-300 pr-1.5 mr-1 gap-0.5">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => execute('undo')}
                className={buttonClass()}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => execute('redo')}
                className={buttonClass()}
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Headings */}
            <select
              aria-label="Paragraph style"
              value={activeFormats.block}
              onChange={(event) => handleHeadingChange(event.target.value as BlockTag)}
              className={selectClass}
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="blockquote">Quote</option>
            </select>

            {/* Font Family */}
            <select
              aria-label="Font family"
              value=""
              onChange={(event) => {
                applyFontFamily(event.target.value);
                event.currentTarget.value = '';
              }}
              className={selectClass}
            >
              <option value="" disabled>
                Font family
              </option>
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font === 'Courier New' ? 'Monospace' : font}
                </option>
              ))}
            </select>

            {/* Font Size */}
            <select
              aria-label="Font size"
              value=""
              onChange={(event) => {
                applyFontSize(event.target.value);
                event.currentTarget.value = '';
              }}
              className={selectClass}
            >
              <option value="" disabled>
                Font size
              </option>
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* B I U S */}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('bold')}
              className={buttonClass(activeFormats.bold)}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
              aria-pressed={activeFormats.bold}
            >
              <Bold className="w-4 h-4 font-bold" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('italic')}
              className={buttonClass(activeFormats.italic)}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
              aria-pressed={activeFormats.italic}
            >
              <Italic className="w-4 h-4 italic" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('underline')}
              className={buttonClass(activeFormats.underline)}
              title="Underline (Ctrl+U)"
              aria-label="Underline"
              aria-pressed={activeFormats.underline}
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('strikeThrough')}
              className={buttonClass(activeFormats.strike)}
              title="Strikethrough"
              aria-label="Strikethrough"
              aria-pressed={activeFormats.strike}
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            {/* Text Color & Highlight Color */}
            <label
              className="flex items-center gap-1 px-1.5 py-1 text-xs cursor-pointer hover:bg-slate-200 rounded"
              title="Text colour"
            >
              <Type className="w-3.5 h-3.5 text-[#bc1169]" />
              <input
                type="color"
                onMouseDown={saveSelection}
                onChange={(event) => execute('foreColor', event.target.value)}
                className="w-4 h-4 border-0 p-0 cursor-pointer rounded overflow-hidden"
                aria-label="Text colour"
              />
            </label>
            <label
              className="flex items-center gap-1 px-1.5 py-1 text-xs cursor-pointer hover:bg-slate-200 rounded"
              title="Highlight colour"
            >
              <span className="text-[11px] font-bold bg-yellow-200 px-1 rounded">A</span>
              <input
                type="color"
                defaultValue="#ffff00"
                onMouseDown={saveSelection}
                onChange={(event) => execute('hiliteColor', event.target.value)}
                className="w-4 h-4 border-0 p-0 cursor-pointer rounded overflow-hidden"
                aria-label="Highlight colour"
              />
            </label>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Alignment */}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('justifyLeft')}
              className={alignmentButtonClass('left')}
              title="Align Left"
              aria-label="Align left"
              aria-pressed={activeFormats.align === 'left'}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('justifyCenter')}
              className={alignmentButtonClass('center')}
              title="Align Center"
              aria-label="Align center"
              aria-pressed={activeFormats.align === 'center'}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('justifyRight')}
              className={alignmentButtonClass('right')}
              title="Align Right"
              aria-label="Align right"
              aria-pressed={activeFormats.align === 'right'}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('justifyFull')}
              className={alignmentButtonClass('justify')}
              title="Justify"
              aria-label="Justify"
              aria-pressed={activeFormats.align === 'justify'}
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Lists */}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('insertUnorderedList')}
              className={buttonClass(activeFormats.unorderedList)}
              title="Bullet List"
              aria-label="Bullet list"
              aria-pressed={activeFormats.unorderedList}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('insertOrderedList')}
              className={buttonClass(activeFormats.orderedList)}
              title="Numbered List"
              aria-label="Numbered list"
              aria-pressed={activeFormats.orderedList}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Inserts: Table, Link, Image, Quote, HR */}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setDialog('table')}
              className={buttonClass()}
              title="Insert Table"
              aria-label="Insert table"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={openLinkDialog}
              className={buttonClass()}
              title="Insert or Edit Link"
              aria-label="Insert or edit link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={openImageDialog}
              className={buttonClass()}
              title="Insert Image or Video"
              aria-label="Insert image or video"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleQuoteToggle}
              className={buttonClass(activeFormats.block === 'blockquote')}
              title="Quote Block"
              aria-label="Quote block"
              aria-pressed={activeFormats.block === 'blockquote'}
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => execute('insertHorizontalRule')}
              className={buttonClass()}
              title="Divider Line"
              aria-label="Insert divider line"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={clearFormatting}
              className={buttonClass()}
              title="Clear Formatting"
              aria-label="Clear formatting"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Source / HTML toggle */}
        <button
          type="button"
          onClick={toggleSource}
          className={`ml-auto px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            showHtml ? 'bg-[#006c93] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          title="Toggle HTML Source"
          aria-label={showHtml ? 'Switch to visual editor' : 'Switch to HTML source'}
          aria-pressed={showHtml}
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
          spellCheck={false}
          aria-label="HTML source"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={saveSelection}
          onKeyUp={() => {
            saveSelection();
            updateActiveFormats();
          }}
          onKeyDown={handleEditorKeyDown}
          onFocus={updateActiveFormats}
          onBlur={handleEditorBlur}
          style={{ minHeight }}
          className="wysiwyg-content w-full p-4 focus:outline-none leading-relaxed text-slate-800 overflow-y-auto"
          data-placeholder={placeholder}
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text content"
        />
      )}

      {/* Inline link dialog */}
      {dialog === 'link' && (
        <div
          className="absolute inset-0 z-30 bg-[rgba(7,61,89,0.55)] backdrop-blur-[2px] flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-2xl p-5 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wysiwyg-link-title"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                applyLink();
              }
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3
                id="wysiwyg-link-title"
                className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4 text-[#006c93]" />
                {linkForm.editing ? 'Edit Link' : 'Insert Link'}
              </h3>
              <button
                type="button"
                onClick={closeDialog}
                className="p-1.5 rounded-lg text-[#5a7d92] hover:bg-[var(--cream)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                aria-label="Close link dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                Destination URL
              </label>
              <input
                autoFocus
                type="text"
                value={linkForm.url}
                onChange={(event) =>
                  setLinkForm((previous) => ({
                    ...previous,
                    url: event.target.value,
                    error: '',
                  }))
                }
                placeholder="https://... or /treatments/ivf"
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            {!linkForm.editing && (
              <div>
                <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Link Text <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={linkForm.text}
                  onChange={(event) =>
                    setLinkForm((previous) => ({ ...previous, text: event.target.value }))
                  }
                  placeholder="Text shown to patients"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-[var(--ink)] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={linkForm.newTab}
                onChange={(event) =>
                  setLinkForm((previous) => ({ ...previous, newTab: event.target.checked }))
                }
                className="rounded border-slate-300 text-[#006c93] focus:ring-[#006c93]"
              />
              Open link in a new tab
            </label>

            {linkForm.error && (
              <p className="text-[11px] text-rose-600 font-medium">{linkForm.error}</p>
            )}

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[rgba(22,55,76,0.1)]">
              <div>
                {linkForm.editing && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Remove Link
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="btn btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {linkForm.editing ? 'Update Link' : 'Insert Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline image dialog */}
      {dialog === 'image' && (
        <div
          className="absolute inset-0 z-30 bg-[rgba(7,61,89,0.55)] backdrop-blur-[2px] flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-2xl p-5 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wysiwyg-image-title"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                applyImage();
              }
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3
                id="wysiwyg-image-title"
                className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#006c93]" />
                Insert Image or Video
              </h3>
              <button
                type="button"
                onClick={closeDialog}
                className="p-1.5 rounded-lg text-[#5a7d92] hover:bg-[var(--cream)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                aria-label="Close media dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                Media URL
              </label>
              <input
                autoFocus
                type="text"
                value={imageForm.url}
                onChange={(event) =>
                  setImageForm((previous) => ({
                    ...previous,
                    url: event.target.value,
                    error: '',
                  }))
                }
                placeholder="https://... or /uploads/..."
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                Alt Text <span className="font-normal normal-case tracking-normal">(for accessibility)</span>
              </label>
              <input
                type="text"
                value={imageForm.alt}
                onChange={(event) =>
                  setImageForm((previous) => ({ ...previous, alt: event.target.value }))
                }
                placeholder="Describe the image"
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            <button
              type="button"
              onClick={openMediaLibrary}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[rgba(22,55,76,0.25)] bg-[var(--cream)]/50 hover:bg-[var(--mint)] text-xs font-bold text-[#006c93] transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Choose from Media Library or Upload
            </button>

            {imageForm.error && (
              <p className="text-[11px] text-rose-600 font-medium">{imageForm.error}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(22,55,76,0.1)]">
              <button
                type="button"
                onClick={closeDialog}
                className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyImage}
                className="btn btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline table dialog */}
      {dialog === 'table' && (
        <div
          className="absolute inset-0 z-30 bg-[rgba(7,61,89,0.55)] backdrop-blur-[2px] flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-2xl p-5 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wysiwyg-table-title"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                applyTable();
              }
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(22,55,76,0.1)]">
              <h3
                id="wysiwyg-table-title"
                className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2"
              >
                <Table className="w-4 h-4 text-[#006c93]" />
                Insert Table
              </h3>
              <button
                type="button"
                onClick={closeDialog}
                className="p-1.5 rounded-lg text-[#5a7d92] hover:bg-[var(--cream)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                aria-label="Close table dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Rows
                </label>
                <input
                  autoFocus
                  type="number"
                  min={1}
                  max={30}
                  value={tableForm.rows}
                  onChange={(event) =>
                    setTableForm((previous) => ({
                      ...previous,
                      rows: Number(event.target.value),
                    }))
                  }
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#5a7d92] uppercase tracking-wider mb-1.5">
                  Columns
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={tableForm.cols}
                  onChange={(event) =>
                    setTableForm((previous) => ({
                      ...previous,
                      cols: Number(event.target.value),
                    }))
                  }
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-3 py-2 text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[var(--ink)] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={tableForm.header}
                onChange={(event) =>
                  setTableForm((previous) => ({ ...previous, header: event.target.checked }))
                }
                className="rounded border-slate-300 text-[#006c93] focus:ring-[#006c93]"
              />
              Include a header row
            </label>

            <p className="text-[11px] text-[#5a7d92]">
              Tip: press Tab inside a table cell to jump to the next cell.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(22,55,76,0.1)]">
              <button
                type="button"
                onClick={closeDialog}
                className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyTable}
                className="btn btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full media library (existing assets + uploads) */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => {
          setIsPickerOpen(false);
          if (!showHtml) {
            window.setTimeout(() => ensureEditorSelection(), 0);
          }
        }}
        onSelect={(selectedUrls) => {
          if (selectedUrls.length > 0) {
            insertMediaHtml(selectedUrls[0], imageForm.alt);
          }
        }}
        allowMultiple={false}
        initialSelected={[]}
        title="Insert Media into Content"
      />
    </div>
  );
};

export default WysiwygEditor;
