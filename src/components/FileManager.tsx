import { useMemo, useState, useCallback, useEffect } from 'react';
import { useDesktopStore, INITIAL_FILESYSTEM, type FileNode } from '../store/desktopStore';
import './FileManager.css';

interface FileManagerProps {
  windowId: string;
  currentPath: string;
}

function getFileIcon(node: FileNode): string {
  if (node.icon) return node.icon;
  if (node.type === 'drive') return '/assets/images/icons/drive-c.svg';
  if (node.type === 'folder') return '/assets/images/icons/folder.svg';
  if (node.name.endsWith('.txt') || node.name.endsWith('.md')) return '📝';
  if (node.name.endsWith('.exe')) return '⚙️';
  if (node.name.endsWith('.dll')) return '🔧';
  if (node.name.endsWith('.jpg') || node.name.endsWith('.png')) return '🖼️';
  if (node.name.endsWith('.wav') || node.name.endsWith('.mp3')) return '🎵';
  if (node.name.endsWith('.zip')) return '📦';
  return '📄';
}

function getNodeByPath(path: string): FileNode | null {
  const parts = path.split('\\').filter(Boolean);
  let current: FileNode = INITIAL_FILESYSTEM;

  for (let i = 1; i < parts.length; i++) {
    if (!current.children) return null;
    const found = current.children.find((c) => c.name === parts[i]);
    if (!found) return null;
    current = found;
  }
  return current;
}

function getPathParts(path: string): string[] {
  return path.split('\\').filter(Boolean);
}

export default function FileManager({ windowId, currentPath }: FileManagerProps) {
  const { updateWindowPath, openWindow } = useDesktopStore();

  // Navigation history
  const [history, setHistory] = useState<string[]>([currentPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Sync with external path changes (e.g. from store)
  useEffect(() => {
    if (!isNavigating && currentPath !== history[historyIndex]) {
      setHistory((prev) => {
        const newHist = prev.slice(0, historyIndex + 1);
        newHist.push(currentPath);
        return newHist;
      });
      setHistoryIndex((prev) => prev + 1);
    }
    setIsNavigating(false);
  }, [currentPath]);

  const navigateTo = useCallback((path: string) => {
    setIsNavigating(true);
    setHistory((prev) => {
      const newHist = prev.slice(0, historyIndex + 1);
      newHist.push(path);
      return newHist;
    });
    setHistoryIndex((prev) => prev + 1);
    updateWindowPath(windowId, path);
  }, [windowId, historyIndex, updateWindowPath]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    const newIndex = historyIndex - 1;
    const path = history[newIndex];
    setHistoryIndex(newIndex);
    setIsNavigating(true);
    updateWindowPath(windowId, path);
  }, [canGoBack, historyIndex, history, windowId, updateWindowPath]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    const newIndex = historyIndex + 1;
    const path = history[newIndex];
    setHistoryIndex(newIndex);
    setIsNavigating(true);
    updateWindowPath(windowId, path);
  }, [canGoForward, historyIndex, history, windowId, updateWindowPath]);

  const goUp = useCallback(() => {
    const parts = getPathParts(currentPath);
    if (parts.length > 1) {
      const parentPath = parts.slice(0, -1).join('\\');
      navigateTo(parentPath);
    }
  }, [currentPath, navigateTo]);

  const currentNode = useMemo(() => getNodeByPath(currentPath), [currentPath]);
  const children = currentNode?.children || [];
  const pathParts = getPathParts(currentPath);

  const handleDoubleClick = (node: FileNode) => {
    if (node.type === 'folder' || node.type === 'drive') {
      navigateTo(currentPath + '\\' + node.name);
    } else if (node.name.endsWith('.txt') || node.name.endsWith('.md')) {
      openWindow('notepad', node.name, '📝', currentPath + '\\' + node.name, { fileContent: node.content || '' });
    } else if (node.name.endsWith('.jpg') || node.name.endsWith('.png') || node.imageSrc) {
      openWindow('picture-viewer', node.name, '🖼️', currentPath + '\\' + node.name, { imageSrc: node.imageSrc || '' });
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const path = pathParts.slice(0, index + 1).join('\\');
    navigateTo(path);
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const path = input.value.trim();
      if (path && getNodeByPath(path)) {
        navigateTo(path);
      }
    }
  };

  const folderCount = children.filter((n) => n.type === 'folder' || n.type === 'drive').length;
  const fileCount = children.filter((n) => n.type === 'file').length;

  return (
    <div className="file-manager">
      {/* Menu Bar */}
      <div className="fm-menubar">
        <span className="fm-menu-item">File</span>
        <span className="fm-menu-item">Edit</span>
        <span className="fm-menu-item">View</span>
        <span className="fm-menu-item">Favorites</span>
        <span className="fm-menu-item">Tools</span>
        <span className="fm-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="fm-toolbar">
        <button className="fm-tool-btn" disabled={!canGoBack} onClick={goBack}>⬅ Back</button>
        <button className="fm-tool-btn" disabled={!canGoForward} onClick={goForward}>➡ Forward</button>
        <button className="fm-tool-btn" disabled={pathParts.length <= 1} onClick={goUp}>⬆ Up</button>
        <div className="fm-tool-separator"></div>
        <button className="fm-tool-btn">🔍 Search</button>
        <button className="fm-tool-btn">📁 Folders</button>
      </div>

      {/* Address Bar */}
      <div className="fm-addressbar">
        <span className="fm-address-label">Address</span>
        <div className="fm-address-input">
          <img src="/assets/images/icons/my-computer.svg" className="fm-address-icon" alt="" />
          <input
            className="fm-address-text"
            defaultValue={currentPath}
            key={currentPath}
            onKeyDown={handleAddressKeyDown}
          />
        </div>
        <button className="fm-go-btn">Go</button>
      </div>

      {/* Breadcrumb */}
      <div className="fm-breadcrumb">
        {pathParts.map((part, i) => (
          <span key={i} className="fm-breadcrumb-part">
            {i > 0 && <span className="fm-breadcrumb-sep">{'>'}</span>}
            <button
              className="fm-breadcrumb-btn"
              onClick={() => handleBreadcrumbClick(i)}
              title={pathParts.slice(0, i + 1).join('\\')}
            >
              {part}
            </button>
          </span>
        ))}
      </div>

      {/* Main Area */}
      <div className="fm-body">
        {/* Left Sidebar */}
        <div className="fm-sidebar">
          <div className="fm-sidebar-section">
            <div className="fm-sidebar-header">
              <span>System Tasks</span>
              <span className="fm-sidebar-toggle">▼</span>
            </div>
            <div className="fm-sidebar-content">
              <a className="fm-sidebar-link">View system information</a>
              <a className="fm-sidebar-link">Add or remove programs</a>
              <a className="fm-sidebar-link">Change a setting</a>
            </div>
          </div>

          <div className="fm-sidebar-section">
            <div className="fm-sidebar-header">
              <span>Other Places</span>
              <span className="fm-sidebar-toggle">▼</span>
            </div>
            <div className="fm-sidebar-content">
              <a className="fm-sidebar-link" onClick={() => navigateTo('My Computer')}>My Computer</a>
              <a className="fm-sidebar-link" onClick={() => navigateTo('My Computer\\Local Disk (C:)\\Documents and Settings\\User\\My Documents')}>My Documents</a>
              <a className="fm-sidebar-link">Shared Documents</a>
              <a className="fm-sidebar-link">My Network Places</a>
            </div>
          </div>

          <div className="fm-sidebar-section">
            <div className="fm-sidebar-header">
              <span>Details</span>
              <span className="fm-sidebar-toggle">▼</span>
            </div>
            <div className="fm-sidebar-content fm-details">
              {currentNode && (
                <>
                  <div className="fm-detail-row">
                    <span className="fm-detail-label">Name:</span>
                    <span className="fm-detail-value">{currentNode.name}</span>
                  </div>
                  {currentNode.type === 'drive' && currentNode.size && (
                    <div className="fm-detail-row">
                      <span className="fm-detail-label">Capacity:</span>
                      <span className="fm-detail-value">{currentNode.size}</span>
                    </div>
                  )}
                  {folderCount > 0 && (
                    <div className="fm-detail-row">
                      <span className="fm-detail-label">Folders:</span>
                      <span className="fm-detail-value">{folderCount}</span>
                    </div>
                  )}
                  {fileCount > 0 && (
                    <div className="fm-detail-row">
                      <span className="fm-detail-label">Files:</span>
                      <span className="fm-detail-value">{fileCount}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="fm-content">
          {/* Section header for drives */}
          {pathParts.length === 1 && (
            <div className="fm-section-header">
              <span className="fm-section-title">Hard Disk Drives</span>
            </div>
          )}

          <div className="fm-file-grid">
            {children.map((node, i) => (
              <div
                key={i}
                className="fm-file-item"
                onDoubleClick={() => handleDoubleClick(node)}
              >
                <div className="fm-file-icon">
                  {typeof getFileIcon(node) === 'string' && getFileIcon(node).startsWith('/') ? (
                    <img src={getFileIcon(node)} alt="" />
                  ) : (
                    <span className="fm-file-emoji">{getFileIcon(node)}</span>
                  )}
                </div>
                <div className="fm-file-name">{node.name}</div>
                {node.type === 'file' && node.size && (
                  <div className="fm-file-size">{node.size}</div>
                )}
                {node.modified && (
                  <div className="fm-file-date">{node.modified}</div>
                )}
              </div>
            ))}
          </div>

          {children.length === 0 && (
            <div className="fm-empty">
              <span>This folder is empty.</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fm-statusbar">
        <span className="fm-status-left">
          {children.length} object(s)
        </span>
        <span className="fm-status-right"></span>
      </div>
    </div>
  );
}
