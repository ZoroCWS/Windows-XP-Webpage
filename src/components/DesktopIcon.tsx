import { useRef } from 'react';
import Draggable from 'react-draggable';
import { useDesktopStore, type DesktopIcon as DesktopIconType } from '../store/desktopStore';
import './DesktopIcon.css';

interface DesktopIconProps {
  icon: DesktopIconType;
}

export default function DesktopIcon({ icon }: DesktopIconProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { selectedIconId, selectIcon, updateIconPosition, openContextMenu, openWindow, openControlPanel } = useDesktopStore();

  const isSelected = selectedIconId === icon.id;

  const handleDragStop = (_: any, data: { x: number; y: number }) => {
    // Snap to grid (75px)
    const gridSize = 75;
    const snappedX = Math.round(data.x / gridSize) * gridSize;
    const snappedY = Math.round(data.y / gridSize) * gridSize;
    updateIconPosition(icon.id, snappedX, snappedY);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectIcon(icon.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (icon.type === 'my-computer') {
      openWindow('my-computer', 'My Computer', '/assets/images/icons/my-computer.svg', 'My Computer');
    } else if (icon.type === 'my-documents') {
      openWindow('folder', 'My Documents', '/assets/images/icons/my-documents.svg', 'My Documents');
    } else if (icon.type === 'recycle-bin') {
      openWindow('recycle-bin', 'Recycle Bin', '/assets/images/icons/recycle-bin-empty.svg', 'Recycle Bin');
    } else if (icon.type === 'folder') {
      openWindow('folder', icon.name, '/assets/images/icons/folder.svg', icon.name);
    } else if (icon.type === 'shortcut') {
      if (icon.id === 'super-mario') {
        openWindow('game', 'Super Mario Bros', '/assets/images/icons/mario.svg', 'Super Mario Bros', {
          gameUrl: 'https://jcw87.github.io/c2-smb1/',
        });
      } else if (icon.id === 'notepad-shortcut') {
        openWindow('notepad', 'Untitled - Notepad', '📝', 'notepad', { fileContent: '' });
      } else if (icon.id === 'calculator-shortcut') {
        openWindow('calculator', 'Calculator', '🧮', 'calculator');
      } else if (icon.id === 'control-panel-shortcut') {
        openControlPanel();
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectIcon(icon.id);
    openContextMenu(e.clientX, e.clientY, 'icon', icon.id);
  };

  const iconSrc = icon.type === 'recycle-bin' && !icon.isEmpty
    ? '/assets/images/icons/recycle-bin-full.svg'
    : icon.icon;

  const isEmoji = iconSrc.length <= 4 && !iconSrc.includes('/');

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: icon.x, y: icon.y }}
      onStop={handleDragStop}
      grid={[75, 75]}
      cancel=".icon-label"
    >
      <div
        ref={nodeRef}
        className={`desktop-icon ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="icon-image">
          {isEmoji ? (
            <span className="icon-emoji">{iconSrc}</span>
          ) : (
            <img src={iconSrc} alt={icon.name} draggable={false} />
          )}
        </div>
        <div className="icon-label">
          <span>{icon.name}</span>
        </div>
      </div>
    </Draggable>
  );
}
