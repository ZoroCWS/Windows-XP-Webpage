import { useEffect, useState } from 'react';
import { useDesktopStore } from '../store/desktopStore';
import './BootScreen.css';

export default function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const setBooting = useDesktopStore((s) => s.setBooting);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev > 80 ? 4 : prev > 50 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 200);

      const completeTimer = setTimeout(() => {
        setBooting(false);
      }, 1200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, setBooting]);

  return (
    <div className={`boot-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="boot-content">
        <div className="boot-logo">
          <div className="windows-flag">
            <div className="flag-pane red"></div>
            <div className="flag-pane green"></div>
            <div className="flag-pane blue"></div>
            <div className="flag-pane yellow"></div>
          </div>
          <div className="boot-text">
            <span className="microsoft-text">Microsoft</span>
            <span className="windows-xp-text">Windows<span className="xp">XP</span></span>
          </div>
        </div>

        <div className="boot-progress-container">
          <div className="boot-progress-bar">
            <div
              className="boot-progress-fill"
              style={{ width: `${progress}%` }}
            >
              {[...Array(30)].map((_, i) => (
                <div key={i} className="progress-block" style={{ '--i': i } as React.CSSProperties}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="boot-footer">
          <span className="copyright">Copyright &copy; Microsoft Corporation</span>
        </div>
      </div>
    </div>
  );
}
