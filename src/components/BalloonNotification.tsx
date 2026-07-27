import { useEffect, useState } from 'react';
import './BalloonNotification.css';

interface BalloonNotificationProps {
  title: string;
  message: string;
  delay?: number;
  duration?: number;
  onClick?: () => void;
}

export default function BalloonNotification({
  title,
  message,
  delay = 1500,
  duration = 8000,
  onClick
}: BalloonNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, delay);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, delay + duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, duration]);

  if (!visible) return null;

  return (
    <div className="xp-balloon" onClick={onClick}>
      <div className="xp-balloon-header">
        <span className="xp-balloon-title">
          <span className="xp-balloon-info-icon">i</span>
          {title}
        </span>
        <button
          className="xp-balloon-close"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
        >
          ✕
        </button>
      </div>
      <div className="xp-balloon-content">
        <p>{message}</p>
      </div>
    </div>
  );
}
