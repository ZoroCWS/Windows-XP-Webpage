import './GameWindow.css';

interface GameWindowProps {
  gameUrl: string;
  title: string;
}

export default function GameWindow({ gameUrl, title }: GameWindowProps) {
  return (
    <div className="game-window">
      <div className="game-toolbar">
        <span className="game-toolbar-text">{title}</span>
      </div>
      <div className="game-iframe-container">
        <iframe
          src={gameUrl}
          className="game-iframe"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
