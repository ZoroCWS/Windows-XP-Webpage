import { useState } from 'react';
import './ShutDown.css';

interface ShutDownProps {
  onClose: () => void;
}

export default function ShutDown({ onClose }: ShutDownProps) {
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTurnOff = () => {
    setIsShuttingDown(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
      }
    }, 80);
  };

  const handleRestart = () => {
    setIsShuttingDown(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 3;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 60);
  };

  if (isShuttingDown) {
    return (
      <div className="shutd-overlay">
        <div className="shutd-progress-screen">
          <div className="shutd-windows-logo">
            <div className="logo-red"></div>
            <div className="logo-green"></div>
            <div className="logo-blue"></div>
            <div className="logo-yellow"></div>
          </div>
          <div className="shutd-progress-text">Windows is shutting down...</div>
          <div className="shutd-progress-bar-container">
            <div className="shutd-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shutd-overlay" onClick={onClose}>
      <div className="shutd-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="shutd-dialog-titlebar">
          <span>Turn off computer</span>
          <button className="shutd-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="shutd-dialog-body">
          <div className="shutd-icon-large">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#E8A000" strokeWidth="3"/>
              <rect x="22" y="6" width="4" height="18" fill="#E8A000" rx="2"/>
            </svg>
          </div>
          <div className="shutd-options">
            <button className="shutd-option" onClick={handleTurnOff}>
              <div className="shutd-option-icon red">
                <svg viewBox="0 0 32 32" width="32" height="32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#E52521" strokeWidth="2"/>
                  <rect x="14" y="4" width="4" height="16" fill="#E52521" rx="2"/>
                </svg>
              </div>
              <span>Stand By</span>
            </button>
            <button className="shutd-option" onClick={handleTurnOff}>
              <div className="shutd-option-icon orange">
                <svg viewBox="0 0 32 32" width="32" height="32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#E8A000" strokeWidth="2"/>
                  <rect x="14" y="4" width="4" height="16" fill="#E8A000" rx="2"/>
                </svg>
              </div>
              <span>Turn Off</span>
            </button>
            <button className="shutd-option" onClick={handleRestart}>
              <div className="shutd-option-icon green">
                <svg viewBox="0 0 32 32" width="32" height="32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#5EBF5E" strokeWidth="2"/>
                  <path d="M10 16 A6 6 0 1 1 16 22" fill="none" stroke="#5EBF5E" strokeWidth="2"/>
                  <polygon points="8,14 12,18 8,18" fill="#5EBF5E"/>
                </svg>
              </div>
              <span>Restart</span>
            </button>
          </div>
          <div className="shutd-help">
            <span className="shutd-question">?</span>
            <span>Why are there three choices?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
