import { useState, useRef, useCallback } from 'react';
import './Notepad.css';

interface NotepadProps {
  windowId: string;
  initialContent?: string;
}

export default function Notepad({ windowId: _windowId, initialContent = '' }: NotepadProps) {
  const [content, setContent] = useState(initialContent);
  const [wordWrap, setWordWrap] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const getCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return { line: 1, col: 1 };
    const pos = ta.selectionStart;
    const textBefore = ta.value.substring(0, pos);
    const lines = textBefore.split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }, []);

  const cursorPos = getCursorPos();

  const handleNew = () => {
    if (content.trim() && !window.confirm('Save changes to untitled?')) return;
    setContent('');
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') setContent(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Untitled.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    textareaRef.current?.select();
  };

  const handleTimeDate = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US');
    const insert = `${timeStr} ${dateStr}`;
    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const before = content.substring(0, start);
      const after = content.substring(ta.selectionEnd);
      setContent(before + insert + after);
    } else {
      setContent(content + insert);
    }
  };

  return (
    <div className="notepad">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".txt,.log,.md,.json,.xml,.html,.css,.js"
        onChange={handleFileLoad}
      />

      {/* Menu Bar */}
      <div className="notepad-menubar">
        <div className="notepad-menu-item-wrapper">
          <span className="notepad-menu-item">File</span>
          <div className="notepad-dropdown">
            <div className="notepad-dropdown-item" onClick={handleNew}><span className="menu-shortcut">Ctrl+N</span>New</div>
            <div className="notepad-dropdown-item" onClick={handleOpen}><span className="menu-shortcut">Ctrl+O</span>Open...</div>
            <div className="notepad-dropdown-item" onClick={handleSave}><span className="menu-shortcut">Ctrl+S</span>Save</div>
            <div className="notepad-dropdown-divider"></div>
            <div className="notepad-dropdown-item disabled">Page Setup...</div>
            <div className="notepad-dropdown-item disabled">Print...</div>
            <div className="notepad-dropdown-divider"></div>
            <div className="notepad-dropdown-item disabled">Exit</div>
          </div>
        </div>
        <div className="notepad-menu-item-wrapper">
          <span className="notepad-menu-item">Edit</span>
          <div className="notepad-dropdown">
            <div className="notepad-dropdown-item disabled"><span className="menu-shortcut">Ctrl+Z</span>Undo</div>
            <div className="notepad-dropdown-divider"></div>
            <div className="notepad-dropdown-item disabled"><span className="menu-shortcut">Ctrl+X</span>Cut</div>
            <div className="notepad-dropdown-item disabled"><span className="menu-shortcut">Ctrl+C</span>Copy</div>
            <div className="notepad-dropdown-item disabled"><span className="menu-shortcut">Ctrl+V</span>Paste</div>
            <div className="notepad-dropdown-item disabled"><span className="menu-shortcut">Del</span>Delete</div>
            <div className="notepad-dropdown-divider"></div>
            <div className="notepad-dropdown-item" onClick={handleSelectAll}><span className="menu-shortcut">Ctrl+A</span>Select All</div>
            <div className="notepad-dropdown-item" onClick={handleTimeDate}><span className="menu-shortcut">F5</span>Time/Date</div>
          </div>
        </div>
        <div className="notepad-menu-item-wrapper">
          <span className="notepad-menu-item">Format</span>
          <div className="notepad-dropdown">
            <div className="notepad-dropdown-item" onClick={() => setWordWrap(!wordWrap)}>
              {wordWrap ? '✓ ' : '  '}Word Wrap
            </div>
            <div className="notepad-dropdown-item" onClick={() => setShowStatusBar(!showStatusBar)}>
              {showStatusBar ? '✓ ' : '  '}Status Bar
            </div>
          </div>
        </div>
        <div className="notepad-menu-item-wrapper">
          <span className="notepad-menu-item">View</span>
          <div className="notepad-dropdown">
            <div className="notepad-dropdown-item disabled">Zoom</div>
          </div>
        </div>
        <div className="notepad-menu-item-wrapper">
          <span className="notepad-menu-item">Help</span>
          <div className="notepad-dropdown">
            <div className="notepad-dropdown-item disabled">About Notepad</div>
          </div>
        </div>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        className="notepad-textarea"
        value={content}
        onChange={handleTextChange}
        spellCheck={false}
        wrap={wordWrap ? 'on' : 'off'}
      />

      {/* Status Bar */}
      {showStatusBar && (
        <div className="notepad-statusbar">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
        </div>
      )}
    </div>
  );
}
