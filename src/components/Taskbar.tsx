import { useEffect } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import './Taskbar.css';

export default function Taskbar() {
  const { currentTime, setCurrentTime, isStartMenuOpen, toggleStartMenu, windows, activeWindowId, focusWindow, minimizeWindow, minimizeAll, restoreAll } = useDesktopStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [setCurrentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + '\n' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handleTaskButtonClick = (win: typeof windows[0]) => {
    if (win.id === activeWindowId && !win.isMinimized) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const handleShowDesktop = () => {
    const hasVisible = windows.some((w) => !w.isMinimized);
    if (hasVisible) {
      minimizeAll();
    } else {
      restoreAll();
    }
  };

  const allMinimized = windows.length > 0 && windows.every((w) => w.isMinimized);

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button
          className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
          onClick={toggleStartMenu}
        >
          <div className="start-button-content">
            <div className="start-flag">
              <div className="sf-pane red"></div>
              <div className="sf-pane green"></div>
              <div className="sf-pane blue"></div>
              <div className="sf-pane yellow"></div>
            </div>
            <span className="start-text">start</span>
          </div>
        </button>

        <div className="quick-launch">
          <div className="quick-launch-divider"></div>
          <button
            className={`quick-launch-btn show-desktop-btn ${allMinimized ? 'active' : ''}`}
            onClick={handleShowDesktop}
            title="Show Desktop"
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              <rect x="1" y="1" width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" rx="1"/>
              <rect x="3" y="10" width="10" height="3" fill="white" opacity="0.6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="taskbar-middle">
        <div className="task-buttons">
          {windows.map((win) => (
            <button
              key={win.id}
              className={`task-button ${win.id === activeWindowId && !win.isMinimized ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
              onClick={() => handleTaskButtonClick(win)}
              title={win.title}
            >
              {win.icon.length <= 4 && !win.icon.includes('/') ? (
                <span className="task-button-emoji">{win.icon}</span>
              ) : (
                <img src={win.icon} className="task-button-icon" alt="" />
              )}
              <span className="task-button-text">{win.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="taskbar-right">
        <div className="system-tray">
          <div className="tray-icons">
            <div className="tray-icon volume" title="Volume: 50%">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M2 5h2l3-3v12l-3-3H2V5z" fill="white"/>
                <path d="M10 4c1.5 1 2 2.5 2 4s-.5 3-2 4" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="tray-icon network" title="Local Area Connection - Connected">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <rect x="2" y="8" width="3" height="6" fill="white"/>
                <rect x="6" y="5" width="3" height="9" fill="white"/>
                <rect x="10" y="2" width="3" height="12" fill="white"/>
              </svg>
            </div>
          </div>
          <div className="tray-clock" title={formatFullDate(currentTime)}>
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
