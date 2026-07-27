import { useRef, useEffect, useCallback, useState } from 'react';
import { useDesktopStore, type WindowItem } from '../store/desktopStore';
import './Window.css';

interface WindowProps {
  window: WindowItem;
  children: React.ReactNode;
}

export default function Window({ window: win, children }: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { activeWindowId, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPosition } = useDesktopStore();
  const [isDragging, setIsDragging] = useState(false);
  const [animState, setAnimState] = useState<'none' | 'opening' | 'minimizing' | 'restoring'>('none');
  const wasMinimizedRef = useRef(win.isMinimized);

  const isActive = activeWindowId === win.id;

  // Opening animation
  useEffect(() => {
    setAnimState('opening');
    const timer = setTimeout(() => setAnimState('none'), 200);
    return () => clearTimeout(timer);
  }, []);

  // Minimize/restore animation
  useEffect(() => {
    if (win.isMinimized && !wasMinimizedRef.current) {
      // Just minimized — animate out then hide
      setAnimState('minimizing');
      const timer = setTimeout(() => {
        setAnimState('none');
      }, 200);
      wasMinimizedRef.current = true;
      return () => clearTimeout(timer);
    } else if (!win.isMinimized && wasMinimizedRef.current) {
      // Just restored — animate in
      setAnimState('restoring');
      const timer = setTimeout(() => setAnimState('none'), 250);
      wasMinimizedRef.current = false;
      return () => clearTimeout(timer);
    }
  }, [win.isMinimized]);

  // Update z-index
  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.style.zIndex = String(win.zIndex);
    }
  }, [win.zIndex]);

  const handleFocus = () => {
    focusWindow(win.id);
  };

  // Resize handler
  const handleResize = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.width;
    const startHeight = win.height;
    const startPosX = win.x;
    const startPosY = win.y;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('e')) newWidth = Math.max(280, startWidth + dx);
      if (direction.includes('w')) {
        newWidth = Math.max(280, startWidth - dx);
        newX = startPosX + (startWidth - newWidth);
      }
      if (direction.includes('s')) newHeight = Math.max(180, startHeight + dy);
      if (direction.includes('n')) {
        newHeight = Math.max(180, startHeight - dy);
        newY = startPosY + (startHeight - newHeight);
      }

      const node = nodeRef.current;
      if (node) {
        node.style.width = newWidth + 'px';
        node.style.height = newHeight + 'px';
        node.style.left = newX + 'px';
        node.style.top = newY + 'px';
      }
    };

    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('e')) newWidth = Math.max(280, startWidth + dx);
      if (direction.includes('w')) {
        newWidth = Math.max(280, startWidth - dx);
        newX = startPosX + (startWidth - newWidth);
      }
      if (direction.includes('s')) newHeight = Math.max(180, startHeight + dy);
      if (direction.includes('n')) {
        newHeight = Math.max(180, startHeight - dy);
        newY = startPosY + (startHeight - newHeight);
      }

      updateWindowPosition(win.id, newX, newY);
      const node = nodeRef.current;
      if (node) {
        node.style.width = newWidth + 'px';
        node.style.height = newHeight + 'px';
      }
    };

    document.body.style.cursor = e.currentTarget.getAttribute('data-cursor') || 'default';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [win, updateWindowPosition]);

  // If minimized and not animating, don't render
  if (win.isMinimized && animState === 'none') return null;

  const isMaximized = win.isMaximized;

  const style: React.CSSProperties = isMaximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 30px)', position: 'fixed' }
    : { width: win.width, height: win.height, left: win.x, top: win.y };

  const animClass = animState !== 'none' ? ` ${animState}` : '';

  return (
    <div
      ref={nodeRef}
      className={`xp-window ${isActive ? 'active' : 'inactive'} ${isDragging ? 'dragging' : ''}${animClass}`}
      style={{ ...style, zIndex: win.zIndex }}
      onMouseDown={handleFocus}
    >
      {/* Title Bar - Draggable */}
      <div
        className="window-titlebar"
        onDoubleClick={() => maximizeWindow(win.id)}
        onMouseDown={(e) => {
          if (isMaximized) return;
          setIsDragging(true);
          const startX = e.clientX - win.x;
          const startY = e.clientY - win.y;

          const onMouseMove = (ev: MouseEvent) => {
            updateWindowPosition(win.id, ev.clientX - startX, ev.clientY - startY);
          };
          const onMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }}
      >
        <div className="titlebar-left">
          {win.icon.length <= 4 && !win.icon.includes('/') ? (
            <span className="titlebar-emoji">{win.icon}</span>
          ) : (
            <img src={win.icon} className="titlebar-icon" alt="" />
          )}
          <span className="titlebar-text">{win.title}</span>
        </div>
        <div className="titlebar-buttons">
          <button className="titlebar-btn minimize" onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}>
            <svg viewBox="0 0 12 12" width="12" height="12"><rect x="2" y="9" width="8" height="2" fill="white"/></svg>
          </button>
          <button className="titlebar-btn maximize" onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}>
            {isMaximized ? (
              <svg viewBox="0 0 12 12" width="12" height="12">
                <rect x="3" y="1" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5"/>
                <rect x="1" y="3" width="8" height="8" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" width="12" height="12"><rect x="1" y="1" width="10" height="10" fill="none" stroke="white" strokeWidth="1.5"/></svg>
            )}
          </button>
          <button className="titlebar-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}>
            <svg viewBox="0 0 12 12" width="12" height="12">
              <line x1="2" y1="2" x2="10" y2="10" stroke="white" strokeWidth="2"/>
              <line x1="10" y1="2" x2="2" y2="10" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content">
        {children}
      </div>

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <div className="resize-handle resize-n" data-cursor="ns-resize" onMouseDown={(e) => handleResize(e, 'n')} />
          <div className="resize-handle resize-s" data-cursor="ns-resize" onMouseDown={(e) => handleResize(e, 's')} />
          <div className="resize-handle resize-e" data-cursor="ew-resize" onMouseDown={(e) => handleResize(e, 'e')} />
          <div className="resize-handle resize-w" data-cursor="ew-resize" onMouseDown={(e) => handleResize(e, 'w')} />
          <div className="resize-handle resize-ne" data-cursor="nesw-resize" onMouseDown={(e) => handleResize(e, 'ne')} />
          <div className="resize-handle resize-nw" data-cursor="nwse-resize" onMouseDown={(e) => handleResize(e, 'nw')} />
          <div className="resize-handle resize-se" data-cursor="nwse-resize" onMouseDown={(e) => handleResize(e, 'se')} />
          <div className="resize-handle resize-sw" data-cursor="nesw-resize" onMouseDown={(e) => handleResize(e, 'sw')} />
        </>
      )}
    </div>
  );
}
