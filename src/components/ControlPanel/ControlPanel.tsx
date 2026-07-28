import { useState } from 'react';
import './ControlPanel.css';

export default function ControlPanel() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'appearance-themes', name: 'Appearance and Themes', icon: '🎨' },
    { id: 'network-internet', name: 'Network and Internet Connections', icon: '🌐' },
    { id: 'add-remove-programs', name: 'Add or Remove Programs', icon: '📦' },
    { id: 'performance-maintenance', name: 'Performance and Maintenance', icon: '⚙️' },
    { id: 'printers-faxes', name: 'Printers and Other Hardware', icon: '🖨️' },
    { id: 'user-accounts', name: 'User Accounts', icon: '👤' },
    { id: 'date-time-language', name: 'Date, Time, Language, and Regional Options', icon: '📅' },
    { id: 'accessibility', name: 'Accessibility Options', icon: '♿' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h2>Control Panel</h2>
      </div>
      <div className="control-panel-body">
        <div className="control-panel-sidebar">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
        <div className="control-panel-content">
          {selectedCategory ? (
            <div className="category-details">
              <h3>{categories.find(c => c.id === selectedCategory)?.name}</h3>
              <p className="placeholder-text">
                This is a simplified representation of the Windows XP Control Panel.
                In a full implementation, selecting a category would open the corresponding
                settings dialog or wizard.
              </p>
              <div className="placeholder-icon">📄</div>
            </div>
          ) : (
            <div className="welcome-message">
              <h3>Pick a category to view and adjust your computer settings.</h3>
              <p className="instruction-text">
                Click a category in the left pane to see common tasks and related settings.
              </p>
              <div className="welcome-icon">💻</div>
            </div>
          )}
        </div>
      </div>
      <div className="control-panel-footer">
        <button className="cp-button" onClick={() => { /* Close window handled by parent */ }}>
          Close
        </button>
        <button className="cp-button cp-button-help" onClick={() => alert('Help not implemented in this demo')}>
          Help
        </button>
      </div>
    </div>
  );
}