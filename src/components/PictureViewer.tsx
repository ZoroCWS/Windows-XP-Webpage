import './PictureViewer.css';

interface PictureViewerProps {
  windowId: string;
  imageSrc: string;
  title: string;
}

export default function PictureViewer({ windowId: _windowId, imageSrc, title }: PictureViewerProps) {
  return (
    <div className="picture-viewer">
      {/* Menu Bar */}
      <div className="pv-menubar">
        <span className="pv-menu-item">File</span>
        <span className="pv-menu-item">Edit</span>
        <span className="pv-menu-item">View</span>
        <span className="pv-menu-item">Tools</span>
        <span className="pv-menu-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="pv-toolbar">
        <button className="pv-tool-btn" disabled>⬅</button>
        <button className="pv-tool-btn" disabled>➡</button>
        <div className="pv-tool-separator"></div>
        <button className="pv-tool-btn">🔄 Rotate</button>
        <button className="pv-tool-btn">🔍 Zoom In</button>
        <button className="pv-tool-btn">🔍 Zoom Out</button>
      </div>

      {/* Image Area */}
      <div className="pv-image-container">
        <img src={imageSrc} alt={title} className="pv-image" />
      </div>

      {/* Status Bar */}
      <div className="pv-statusbar">
        <span>{title}</span>
      </div>
    </div>
  );
}
