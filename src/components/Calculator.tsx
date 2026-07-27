import { useState } from 'react';
import './Calculator.css';

export default function Calculator() {
  const [display, setDisplay] = useState('0.');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [memory, setMemory] = useState(0);

  const handleDigit = (d: string) => {
    if (resetDisplay) {
      setDisplay(d === '.' ? '0.' : d + '.');
      setResetDisplay(false);
      return;
    }
    if (d === '.' && display.includes('.')) return;
    if (display === '0.' && d !== '.') {
      setDisplay(d + '.');
    } else {
      setDisplay(display + d);
    }
  };

  const handleOp = (op: string) => {
    const val = parseFloat(display);
    if (currentValue !== null && pendingOp && !resetDisplay) {
      const result = calculate(currentValue, val, pendingOp);
      setDisplay(formatNumber(result));
      setCurrentValue(result);
    } else {
      setCurrentValue(val);
    }
    setPendingOp(op);
    setResetDisplay(true);
  };

  const handleEquals = () => {
    if (currentValue === null || !pendingOp) return;
    const val = parseFloat(display);
    const result = calculate(currentValue, val, pendingOp);
    setDisplay(formatNumber(result));
    setCurrentValue(null);
    setPendingOp(null);
    setResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const formatNumber = (n: number): string => {
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString() + '.';
    const s = n.toPrecision(12);
    return parseFloat(s).toString() + (s.includes('.') && s.endsWith('0') ? '' : '.');
  };

  const handleClear = () => {
    setDisplay('0.');
    setCurrentValue(null);
    setPendingOp(null);
    setResetDisplay(false);
  };

  const handleClearEntry = () => {
    setDisplay('0.');
    setResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length <= 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0.');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleSign = () => {
    if (display === '0.') return;
    if (display.startsWith('-')) {
      setDisplay(display.slice(1));
    } else {
      setDisplay('-' + display);
    }
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Error');
      return;
    }
    setDisplay(formatNumber(Math.sqrt(val)));
    setResetDisplay(true);
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    const base = currentValue ?? 0;
    setDisplay(formatNumber(base * val / 100));
    setResetDisplay(true);
  };

  const handleReciprocal = () => {
    const val = parseFloat(display);
    if (val === 0) {
      setDisplay('Error');
      return;
    }
    setDisplay(formatNumber(1 / val));
    setResetDisplay(true);
  };

  const handleMemory = (op: string) => {
    const val = parseFloat(display);
    switch (op) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(formatNumber(memory)); setResetDisplay(true); break;
      case 'MS': setMemory(val); break;
      case 'M+': setMemory(memory + val); break;
    }
  };

  const displayValue = display.endsWith('.') ? display.slice(0, -1) : display;

  return (
    <div className="calculator">
      <div className="calc-menubar">
        <span className="calc-menu-item">Edit</span>
        <span className="calc-menu-item">View</span>
        <span className="calc-menu-item">Help</span>
      </div>

      <div className="calc-display-row">
        <input className="calc-display" type="text" value={displayValue} readOnly />
      </div>

      <div className="calc-memory-row">
        <button className="calc-mem-btn" onClick={() => handleMemory('MC')}>MC</button>
        <div className="calc-mem-indicator">{memory !== 0 ? 'M' : ''}</div>
      </div>

      <div className="calc-buttons">
        <div className="calc-btn-col">
          <button className="calc-btn mem" onClick={() => handleMemory('MR')}>MR</button>
          <button className="calc-btn mem" onClick={() => handleMemory('MS')}>MS</button>
          <button className="calc-btn mem" onClick={() => handleMemory('M+')}>M+</button>
        </div>
        <div className="calc-btn-col">
          <button className="calc-btn func" onClick={handleBackspace}>Back</button>
          <button className="calc-btn func" onClick={handleClearEntry}>CE</button>
          <button className="calc-btn func" onClick={handleClear}>C</button>
        </div>
        <div className="calc-btn-grid">
          <button className="calc-btn num" onClick={() => handleDigit('7')}>7</button>
          <button className="calc-btn num" onClick={() => handleDigit('8')}>8</button>
          <button className="calc-btn num" onClick={() => handleDigit('9')}>9</button>
          <button className="calc-btn op" onClick={() => handleOp('/')}>/</button>
          <button className="calc-btn func" onClick={handleSqrt}>sqrt</button>

          <button className="calc-btn num" onClick={() => handleDigit('4')}>4</button>
          <button className="calc-btn num" onClick={() => handleDigit('5')}>5</button>
          <button className="calc-btn num" onClick={() => handleDigit('6')}>6</button>
          <button className="calc-btn op" onClick={() => handleOp('*')}>*</button>
          <button className="calc-btn func" onClick={handlePercent}>%</button>

          <button className="calc-btn num" onClick={() => handleDigit('1')}>1</button>
          <button className="calc-btn num" onClick={() => handleDigit('2')}>2</button>
          <button className="calc-btn num" onClick={() => handleDigit('3')}>3</button>
          <button className="calc-btn op" onClick={() => handleOp('-')}>-</button>
          <button className="calc-btn func" onClick={handleReciprocal}>1/x</button>

          <button className="calc-btn num" onClick={() => handleDigit('0')}>0</button>
          <button className="calc-btn func" onClick={handleSign}>+/-</button>
          <button className="calc-btn num" onClick={() => handleDigit('.')}>.</button>
          <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>
          <button className="calc-btn equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
}
