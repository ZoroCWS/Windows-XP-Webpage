import { useEffect, useRef, useState } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import Window from './Window';
import FileManager from './FileManager';
import Notepad from './Notepad';
import Calculator from './Calculator';
import GameWindow from './GameWindow';
import PictureViewer from './PictureViewer';
import ShutDown from './ShutDown';
import BalloonNotification from './BalloonNotification';
import './Desktop.css';

export default function Desktop() {
  const {
    icons,
    windows,
    activeWindowId,
    closeContextMenu,
    closeStartMenu,
    closeWindow,
    selectIcon,
    openContextMenu,
    toggleStartMenu,
    minimizeAll,
    restoreAll,
    openWindow,
  } = useDesktopStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedSound = useRef(false);
  const [showShutDown, setShowShutDown] = useState(false);

  // Play startup sound
  useEffect(() => {
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true;
      const audio = new Audio('/assets/sounds/startup.mp3');
      audio.volume = 0.5;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const playOnInteraction = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('click', playOnInteraction);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Global right-click: prevent browser context menu, show XP context menu
  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      // Don't override context menu inside windows, start menu, or context menu itself
      if (
        target.closest('.xp-window') ||
        target.closest('.start-menu') ||
        target.closest('.context-menu') ||
        target.closest('.taskbar')
      ) {
        return;
      }

      // Check if clicking on a desktop icon
      const iconEl = target.closest('.desktop-icon');
      if (iconEl) {
        const iconId = iconEl.getAttribute('data-icon-id');
        if (iconId) {
          selectIcon(iconId);
          openContextMenu(e.clientX, e.clientY, 'icon', iconId);
          return;
        }
      }

      // Desktop background right-click
      openContextMenu(e.clientX, e.clientY, 'desktop');
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.start-menu') && !target.closest('.start-button')) {
        closeStartMenu();
      }
      if (!target.closest('.context-menu') && !target.closest('.desktop-icon')) {
        closeContextMenu();
      }
    };

    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [closeContextMenu, closeStartMenu, openContextMenu, selectIcon]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Win key (Meta key) — toggle start menu
      if (e.key === 'Meta' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        toggleStartMenu();
        return;
      }

      // Alt+F4 — close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
        return;
      }

      // Escape — close start menu / context menu
      if (e.key === 'Escape') {
        closeStartMenu();
        closeContextMenu();
        return;
      }

      // Win+D — show desktop (minimize all / restore all)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        const hasVisible = windows.some((w) => !w.isMinimized);
        if (hasVisible) {
          minimizeAll();
        } else {
          restoreAll();
        }
        return;
      }

      // Skip remaining shortcuts if user is typing in an input
      if (isInputFocused) return;

      // Delete — delete selected icon (placeholder)
      if (e.key === 'Delete') {
        // placeholder for future icon deletion
      }

      // F2 — rename selected icon (placeholder)
      if (e.key === 'F2') {
        // placeholder for future rename
      }

      // F5 — refresh (reloads page like XP)
      if (e.key === 'F5') {
        e.preventDefault();
        window.location.reload();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, windows, closeWindow, closeStartMenu, closeContextMenu, toggleStartMenu, minimizeAll, restoreAll]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectIcon(null);
    }
  };

  const renderWindowContent = (win: typeof windows[0]) => {
    switch (win.type) {
      case 'my-computer':
      case 'folder':
      case 'recycle-bin':
        return <FileManager windowId={win.id} currentPath={win.currentPath} />;
      case 'notepad':
        return <Notepad windowId={win.id} initialContent={win.fileContent || ''} />;
      case 'calculator':
        return <Calculator />;
      case 'game':
        return <GameWindow gameUrl={win.gameUrl || ''} title={win.title} />;
      case 'picture-viewer':
        return <PictureViewer windowId={win.id} imageSrc={win.imageSrc || ''} title={win.title} />;
      default:
        return <FileManager windowId={win.id} currentPath={win.currentPath} />;
    }
  };

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <div className="desktop-icons">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>

      {/* Render Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {renderWindowContent(win)}
        </Window>
      ))}

      <StartMenu onShutDown={() => setShowShutDown(true)} />
      <Taskbar />
      <ContextMenu />
      {showShutDown && <ShutDown onClose={() => setShowShutDown(false)} />}
      
      <BalloonNotification
        title="Welcome to Windows XP"
        message="Click here to learn about this interactive replica and explore its cool features!"
        delay={2500}
        duration={12000}
        onClick={() => {
          openWindow('notepad', 'Welcome to Windows XP.txt', '📝', 'Welcome to Windows XP.txt', {
            fileContent: `Welcome to Microsoft Windows XP!\n\nThank you for exploring this interactive Windows XP website.\n\nFeatures built:\n- Authentic Bliss wallpaper & Luna taskbar\n- Window management with draggable windows\n- Full file manager (My Computer) with directory navigation\n- Start Menu with All Programs\n- Custom right-click context menu\n- Startup sound & classic cursors\n- Standard Calculator, functional Notepad & Super Mario!`
          });
        }}
      />
    </div>
  );
}
