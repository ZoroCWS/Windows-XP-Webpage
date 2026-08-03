import { useState } from 'react';
import './BrowserWindow.css';

const MENU_ITEMS = ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'];

const QUICK_LINKS: { label: string; url: string }[] = [
  { label: 'Google', url: 'https://www.google.com' },
  { label: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { label: 'YouTube', url: 'https://www.youtube.com' },
  { label: 'GitHub', url: 'https://www.github.com' },
  { label: 'MSN', url: 'https://www.msn.com' },
];

function isUrl(input: string): boolean {
  if (/^https?:\/\//i.test(input)) return true;
  return /\.[a-z]{2,}([/:?#]|$)/i.test(input) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(input);
}

export default function BrowserWindow() {
  const [address, setAddress] = useState('https://www.google.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusText, setStatusText] = useState('Done');

  const openInHost = (url: string, status: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setStatusText(status);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    openInHost(
      `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      `Opening Google Search for "${q}" in your browser...`
    );
    setSearchQuery('');
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const input = address.trim();
    if (!input) return;
    const url = isUrl(input)
      ? /^https?:\/\//i.test(input)
        ? input
        : `https://${input}`
      : `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    openInHost(url, `Opening ${url} in your browser...`);
  };

  const handleFeelingLucky = () => {
    const q = searchQuery.trim();
    if (!q) return;
    openInHost(
      `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      `Opening Google Search for "${q}" in your browser...`
    );
    setSearchQuery('');
  };

  const goHome = () => {
    setAddress('https://www.google.com');
    setStatusText('Done');
  };

  return (
    <div className="ie-browser">
      <div className="ie-menubar">
        {MENU_ITEMS.map((item) => (
          <button key={item} type="button" className="ie-menu-item">
            {item}
          </button>
        ))}
      </div>

      <div className="ie-toolbar">
        <button type="button" className="ie-toolbtn" disabled title="Back">
          ◀
        </button>
        <button type="button" className="ie-toolbtn" disabled title="Forward">
          ▶
        </button>
        <button type="button" className="ie-toolbtn" title="Stop" onClick={() => setStatusText('Done')}>
          ✖
        </button>
        <button type="button" className="ie-toolbtn" title="Refresh" onClick={goHome}>
          ↻
        </button>
        <button type="button" className="ie-toolbtn" title="Home" onClick={goHome}>
          ⌂
        </button>
        <div className="ie-tool-sep" />
        <button type="button" className="ie-toolbtn" title="Search" onClick={() => setStatusText('Type a query below and press Enter.')}>
          🔍
        </button>
        <button type="button" className="ie-toolbtn" title="Favorites" onClick={() => setStatusText('Favorites')}>
          ★
        </button>
        <button type="button" className="ie-toolbtn" title="History" onClick={() => setStatusText('History')}>
          🕘
        </button>
        <div className="ie-tool-sep" />
        <button type="button" className="ie-toolbtn" title="Mail" onClick={() => openInHost('https://mail.google.com', 'Opening Mail in your browser...')}>
          ✉
        </button>
        <button type="button" className="ie-toolbtn" title="Print" onClick={() => setStatusText('Printing is not available in this XP demo.')}>
          🖨
        </button>
      </div>

      <div className="ie-addressbar">
        <span className="ie-address-label">Address</span>
        <img src="/assets/images/icons/ie.svg" alt="" className="ie-address-icon" />
        <form className="ie-address-form" onSubmit={handleGo}>
          <input
            className="ie-address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            spellCheck={false}
          />
          <button type="submit" className="ie-go-btn">
            Go
          </button>
        </form>
      </div>

      <div className="ie-content">
        <div className="ie-google-page">
          <h1 className="ie-google-logo" aria-label="Google">
            <span className="ie-g-b">G</span>
            <span className="ie-g-r">o</span>
            <span className="ie-g-y">o</span>
            <span className="ie-g-b">g</span>
            <span className="ie-g-g">l</span>
            <span className="ie-g-r">e</span>
          </h1>

          <form className="ie-google-search" onSubmit={handleSearch}>
            <input
              className="ie-google-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web"
              spellCheck={false}
            />
            <div className="ie-google-buttons">
              <button type="submit" className="ie-google-btn">
                Google Search
              </button>
              <button type="button" className="ie-google-btn" onClick={handleFeelingLucky}>
                I'm Feeling Lucky
              </button>
            </div>
          </form>

          <div className="ie-quicklinks">
            {QUICK_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                className="ie-quicklink"
                onClick={() => openInHost(link.url, `Opening ${link.url} in your browser...`)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <p className="ie-hint">Searches and links open in your real browser tab.</p>
        </div>
      </div>

      <div className="ie-statusbar">
        <span className="ie-status-text">{statusText}</span>
        <span className="ie-status-right">
          <img src="/assets/images/icons/ie.svg" alt="" className="ie-status-icon" />
          Internet
        </span>
      </div>
    </div>
  );
}
