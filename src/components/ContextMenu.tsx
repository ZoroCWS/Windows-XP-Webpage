import { useEffect, useRef } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import './ContextMenu.css';

export default function ContextMenu() {
  const { contextMenu, closeContextMenu, setViewMode, setSortBy, viewMode, sortBy, openWindow, icons } = useDesktopStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      closeContextMenu();
    };

    if (contextMenu.isOpen) {
      document.addEventListener('click', handleClick);
      document.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen) return null;

  const viewOptions = [
    { label: 'Large Icons', value: 'large-icons' as const, checked: viewMode === 'large-icons' },
    { label: 'Small Icons', value: 'small-icons' as const, checked: viewMode === 'small-icons' },
    { label: 'List', value: 'list' as const, checked: viewMode === 'list' },
    { label: 'Details', value: 'details' as const, checked: viewMode === 'details' },
  ];

  const sortOptions = [
    { label: 'by Name', value: 'name' as const, checked: sortBy === 'name' },
    { label: 'by Size', value: 'size' as const, checked: sortBy === 'size' },
    { label: 'by Type', value: 'type' as const, checked: sortBy === 'type' },
    { label: 'by Date', value: 'date' as const, checked: sortBy === 'date' },
  ];

  const desktopMenuItems = [
    {
      label: 'View',
      submenu: viewOptions.map(opt => ({
        label: opt.label,
        type: 'radio' as const,
        checked: opt.checked,
        action: () => setViewMode(opt.value),
      })),
    },
    {
      label: 'Sort By',
      submenu: sortOptions.map(opt => ({
        label: opt.label,
        type: 'radio' as const,
        checked: opt.checked,
        action: () => setSortBy(opt.value),
      })),
    },
    { type: 'divider' as const },
    { label: 'Refresh', action: () => window.location.reload() },
    { type: 'divider' as const },
    {
      label: 'New',
      submenu: [
        { label: 'Folder', action: () => console.log('New Folder') },
        { label: 'Shortcut', action: () => console.log('New Shortcut') },
        { type: 'divider' as const },
        { label: 'Text Document', action: () => openWindow('notepad', 'Untitled - Notepad', '📝', 'notepad', { fileContent: '' }) },
      ],
    },
    { type: 'divider' as const },
    { label: 'Paste', disabled: true, action: () => {} },
    { label: 'Paste Shortcut', disabled: true, action: () => {} },
    { type: 'divider' as const },
    { label: 'Properties', action: () => console.log('Properties') },
  ];

  const iconMenuItems = [
    {
      label: 'Open', bold: true, action: () => {
        const icon = icons.find((i) => i.id === contextMenu.iconId);
        if (!icon) return;
        if (icon.type === 'my-computer') openWindow('my-computer', 'My Computer', '/assets/images/icons/my-computer.svg', 'My Computer');
        else if (icon.type === 'my-documents') openWindow('folder', 'My Documents', '/assets/images/icons/my-documents.svg', 'My Documents');
        else if (icon.type === 'recycle-bin') openWindow('recycle-bin', 'Recycle Bin', '/assets/images/icons/recycle-bin-empty.svg', 'Recycle Bin');
        else if (icon.type === 'folder') openWindow('folder', icon.name, '/assets/images/icons/folder.svg', icon.name);
        else if (icon.type === 'shortcut') {
          if (icon.id === 'super-mario') openWindow('game', 'Super Mario Bros', '/assets/images/icons/mario.svg', 'Super Mario Bros', { gameUrl: 'https://jcw87.github.io/c2-smb1/' });
          else if (icon.id === 'notepad-shortcut') openWindow('notepad', 'Untitled - Notepad', '📝', 'notepad', { fileContent: '' });
          else if (icon.id === 'calculator-shortcut') openWindow('calculator', 'Calculator', '🧮', 'calculator');
        }
      },
    },
    { type: 'divider' as const },
    { label: 'Cut', action: () => console.log('Cut') },
    { label: 'Copy', action: () => console.log('Copy') },
    { type: 'divider' as const },
    { label: 'Create Shortcut', action: () => console.log('Create Shortcut') },
    { label: 'Delete', action: () => console.log('Delete') },
    { label: 'Rename', action: () => console.log('Rename') },
    { type: 'divider' as const },
    { label: 'Properties', action: () => console.log('Properties') },
  ];

  const menuItems = contextMenu.target === 'desktop' ? desktopMenuItems : iconMenuItems;

  // Adjust position to keep menu on screen
  const menuWidth = 200;
  const menuHeight = 300;
  let x = contextMenu.x;
  let y = contextMenu.y;

  if (x + menuWidth > window.innerWidth) {
    x = window.innerWidth - menuWidth - 5;
  }
  if (y + menuHeight > window.innerHeight) {
    y = window.innerHeight - menuHeight - 5;
  }

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => {
        if ('type' in item && item.type === 'divider') {
          return <div key={index} className="context-menu-divider" />;
        }

        const menuItem = item as any;
        const hasSubmenu = menuItem.submenu && menuItem.submenu.length > 0;

        return (
          <div
            key={index}
            className={`context-menu-item ${menuItem.disabled ? 'disabled' : ''} ${menuItem.bold ? 'bold' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!menuItem.disabled && !hasSubmenu) {
                menuItem.action();
                closeContextMenu();
              }
            }}
          >
            <span className="menu-label">{menuItem.label}</span>
            {menuItem.checked && <span className="menu-check">✓</span>}
            {hasSubmenu && <span className="menu-arrow">▶</span>}

            {hasSubmenu && (
              <div className="context-submenu">
                {menuItem.submenu.map((subItem: any, subIndex: number) => {
                  if ('type' in subItem && subItem.type === 'divider') {
                    return <div key={subIndex} className="context-menu-divider" />;
                  }
                  return (
                    <div
                      key={subIndex}
                      className={`context-menu-item ${subItem.disabled ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!subItem.disabled) {
                          subItem.action();
                          closeContextMenu();
                        }
                      }}
                    >
                      <span className="menu-label">{subItem.label}</span>
                      {subItem.checked && <span className="menu-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
