import { useEffect, useRef, useState } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import './StartMenu.css';

export default function StartMenu({ onShutDown }: { onShutDown?: () => void }) {
  const { isStartMenuOpen, closeStartMenu, openWindow } = useDesktopStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAllProgramsOpen, setIsAllProgramsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        const target = e.target as HTMLElement;
        if (!target.closest('.start-button')) {
          closeStartMenu();
        }
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartMenuOpen, closeStartMenu]);

  useEffect(() => {
    setIsAllProgramsOpen(false);
  }, [isStartMenuOpen]);

  if (!isStartMenuOpen) return null;

  const handleOpenMyComputer = () => {
    openWindow('my-computer', 'My Computer', '/assets/images/icons/my-computer.svg', 'My Computer');
    closeStartMenu();
  };

  const handleOpenMyDocuments = () => {
    openWindow('folder', 'My Documents', '/assets/images/icons/my-documents.svg', 'My Computer\\Local Disk (C:)\\Documents and Settings\\User\\My Documents');
    closeStartMenu();
  };

  const handleOpenItem = (name: string) => {
    if (name === 'Notepad') {
      openWindow('notepad', 'Untitled - Notepad', '📝', 'notepad', { fileContent: '' });
    } else if (name === 'Calculator') {
      openWindow('calculator', 'Calculator', '🧮', 'calculator');
    } else if (name === 'My Computer') {
      handleOpenMyComputer();
    } else if (name === 'My Documents') {
      handleOpenMyDocuments();
    } else if (name === 'Super Mario Bros') {
      openWindow('game', 'Super Mario Bros', '/assets/images/icons/mario.svg', 'Super Mario Bros', {
        gameUrl: 'https://jcw87.github.io/c2-smb1/',
      });
    }
    closeStartMenu();
  };

  const pinnedItems = [
    { icon: '🌐', name: 'Internet Explorer', subtitle: 'Internet Browser', bold: true, action: () => closeStartMenu() },
    { icon: '📧', name: 'Outlook Express', subtitle: 'E-mail', bold: true, action: () => closeStartMenu() },
  ];

  const menuItems = [
    { icon: '📧', name: 'Outlook Express', bold: false, action: () => closeStartMenu() },
    { icon: '🌐', name: 'Internet Explorer', bold: false, action: () => closeStartMenu() },
    { icon: '📨', name: 'MSN Messenger', bold: false, action: () => closeStartMenu() },
  ];

  const allPrograms = [
    { icon: '📝', name: 'Notepad', action: () => handleOpenItem('Notepad') },
    { icon: '🧮', name: 'Calculator', action: () => handleOpenItem('Calculator') },
    { icon: '🎨', name: 'Paint', action: () => closeStartMenu() },
    { icon: '🎵', name: 'Windows Media Player', action: () => closeStartMenu() },
    { icon: '🎮', name: 'Minesweeper', action: () => closeStartMenu() },
    { icon: '🃏', name: 'Solitaire', action: () => closeStartMenu() },
    { icon: '📂', name: 'Windows Explorer', action: () => handleOpenMyComputer() },
    { icon: '🍄', name: 'Super Mario Bros', action: () => handleOpenItem('Super Mario Bros') },
  ];

  const rightColumn = [
    { icon: '📁', name: 'My Documents', bold: true, action: () => handleOpenMyDocuments() },
    { icon: '🖼️', name: 'My Pictures', bold: true, action: () => handleOpenMyDocuments() },
    { icon: '🎵', name: 'My Music', bold: true, action: () => handleOpenMyDocuments() },
    { icon: '💻', name: 'My Computer', bold: true, action: () => handleOpenMyComputer() },
    { divider: true },
    { icon: '⚙️', name: 'Control Panel', action: () => closeStartMenu() },
    { icon: '🖨️', name: 'Printers and Faxes', action: () => closeStartMenu() },
    { icon: '❓', name: 'Help and Support', action: () => closeStartMenu() },
    { icon: '🔍', name: 'Search', action: () => closeStartMenu() },
    { icon: '▶️', name: 'Run...', action: () => closeStartMenu() },
  ];

  return (
    <div className="start-menu" ref={menuRef}>
      <div className="start-menu-header">
        <div className="user-avatar">
          <div className="avatar-placeholder">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <circle cx="24" cy="18" r="10" fill="#FFD5B5"/>
              <ellipse cx="24" cy="42" rx="16" ry="14" fill="#316AC5"/>
            </svg>
          </div>
          <span className="user-name">User</span>
        </div>
      </div>

      <div className="start-menu-body">
        <div className="start-menu-left">
          <div className="start-menu-section">
            {pinnedItems.map((item, i) => (
              <div key={i} className="start-menu-item pinned" onClick={item.action} onMouseEnter={() => setIsAllProgramsOpen(false)}>
                <span className="item-icon">{item.icon}</span>
                <div className="item-text">
                  <span className={`item-name ${item.bold ? 'bold' : ''}`}>{item.name}</span>
                  {item.subtitle && <span className="item-subtitle">{item.subtitle}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="start-menu-divider"></div>

          <div className="start-menu-section">
            {menuItems.map((item, i) => (
              <div key={i} className="start-menu-item" onClick={item.action} onMouseEnter={() => setIsAllProgramsOpen(false)}>
                <span className="item-icon">{item.icon}</span>
                <span className={`item-name ${item.bold ? 'bold' : ''}`}>{item.name}</span>
              </div>
            ))}
          </div>

          <div className="start-menu-divider"></div>

          <div
            className="start-menu-item all-programs"
            onMouseEnter={() => setIsAllProgramsOpen(true)}
          >
            <span className="item-icon">📁</span>
            <span className="item-name bold">All Programs</span>
            <span className="arrow">▶</span>

            {isAllProgramsOpen && (
              <div
                className="all-programs-submenu"
                onMouseEnter={() => setIsAllProgramsOpen(true)}
              >
                {allPrograms.map((item, i) => (
                  <div key={i} className="start-menu-item submenu-item" onClick={item.action}>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="start-menu-right">
          {rightColumn.map((item, i) => {
            if ('divider' in item && item.divider) {
              return <div key={i} className="start-menu-divider"></div>;
            }
            const menuItem = item as any;
            return (
              <div key={i} className="start-menu-item right-item" onClick={menuItem.action}>
                <span className="item-icon">{menuItem.icon || ''}</span>
                <span className={`item-name ${menuItem.bold ? 'bold' : ''}`}>
                  {menuItem.name || ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="start-menu-footer">
        <button className="footer-button">
          <span className="footer-icon">🔒</span>
          <span>Log Off</span>
        </button>
        <button className="footer-button shutdown" onClick={() => { closeStartMenu(); onShutDown?.(); }}>
          <span className="footer-icon">🔴</span>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
}
