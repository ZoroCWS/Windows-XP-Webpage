import { useState } from 'react';
import './RunDialog.css';

export default function RunDialog() {
  const [command, setCommand] = useState('');

  const handleRun = () => {
    alert(`Running command: ${command}`);
  };

  return (
    <div className="run-dialog-content">
      <div className="run-prompt">
        <span className="prompt-label">Type the name of a program, folder, document, or internet address:</span>
        <input 
          className="xp-input run-input" 
          value={command} 
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRun()}
          autoFocus
        />
      </div>
      <div className="run-buttons">
        <button className="xp-button" onClick={handleRun}>OK</button>
        <button className="xp-button" onClick={() => {}}>Cancel</button>
      </div>
    </div>
  );
}
