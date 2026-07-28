import { useState, useEffect, useRef } from 'react';
import './Minesweeper.css';

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function Minesweeper() {
  const ROWS = 9;
  const COLS = 9;
  const MINE_COUNT = 10;

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const [timer, setTimer] = useState(0);
  const [smiley, setSmiley] = useState<'😀' | '😮' | '😎' | '😵'>('😀');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize empty board
  useEffect(() => {
    resetGame();
    return () => stopTimer();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(t + 1, 999));
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [gameState]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGame = () => {
    stopTimer();
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setGameState('idle');
    setMinesLeft(MINE_COUNT);
    setTimer(0);
    setSmiley('😀');
  };

  // Generate mines after the first click to guarantee safety
  const generateMines = (firstR: number, firstC: number, currentBoard: Cell[][]) => {
    let minesPlaced = 0;
    const boardCopy = currentBoard.map(row => row.map(cell => ({ ...cell })));

    while (minesPlaced < MINE_COUNT) {
      const r = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      // Avoid first click and existing mines
      if ((r !== firstR || col !== firstC) && !boardCopy[r][col].isMine) {
        boardCopy[r][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!boardCopy[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && boardCopy[nr][nc].isMine) {
                count++;
              }
            }
          }
          boardCopy[r][c].neighborMines = count;
        }
      }
    }

    return boardCopy;
  };

  const revealCell = (r: number, c: number) => {
    if (gameState === 'lost' || gameState === 'won' || board[r][c].isRevealed || board[r][c].isFlagged) return;

    let currentBoard = board;

    if (gameState === 'idle') {
      currentBoard = generateMines(r, c, board);
      setGameState('playing');
    }

    const boardCopy = currentBoard.map(row => row.map(cell => ({ ...cell })));

    if (boardCopy[r][c].isMine) {
      // Game over! Reveal all mines
      setGameState('lost');
      setSmiley('😵');
      revealAllMines(boardCopy);
      return;
    }

    // Reveal cell and neighbors recursively if 0
    revealRecursive(boardCopy, r, c);
    setBoard(boardCopy);

    // Check Win state
    checkWinCondition(boardCopy);
  };

  const revealRecursive = (boardCopy: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || boardCopy[r][c].isRevealed || boardCopy[r][c].isFlagged) return;

    boardCopy[r][c].isRevealed = true;

    if (boardCopy[r][c].neighborMines === 0 && !boardCopy[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealRecursive(boardCopy, r + dr, c + dc);
        }
      }
    }
  };

  const revealAllMines = (boardCopy: Cell[][]) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (boardCopy[r][c].isMine) {
          boardCopy[r][c].isRevealed = true;
        }
      }
    }
    setBoard(boardCopy);
  };

  const checkWinCondition = (currentBoard: Cell[][]) => {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      setGameState('won');
      setSmiley('😎');
      // Flag all remaining mines
      const finalBoard = currentBoard.map(row => row.map(cell => {
        if (cell.isMine) return { ...cell, isFlagged: true };
        return cell;
      }));
      setBoard(finalBoard);
      setMinesLeft(0);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === 'lost' || gameState === 'won' || board[r][c].isRevealed) return;

    const boardCopy = board.map(row => row.map(cell => ({ ...cell })));
    const cell = boardCopy[r][c];

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft((prev) => prev + 1);
    } else {
      cell.isFlagged = true;
      setMinesLeft((prev) => prev - 1);
    }

    setBoard(boardCopy);
  };

  const handleMouseDown = () => {
    if (gameState === 'playing') setSmiley('😮');
  };

  const handleMouseUp = () => {
    if (gameState === 'playing') setSmiley('😀');
  };

  // Format digit string with leading zeros
  const formatDigits = (num: number) => {
    if (num < 0) return '000';
    return String(num).padStart(3, '0');
  };

  return (
    <div className="minesweeper-app" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="minesweeper-window-inner">
        {/* Top digital scoreboard */}
        <div className="minesweeper-scoreboard">
          <div className="digital-counter">{formatDigits(minesLeft)}</div>
          <button className="minesweeper-smiley" onClick={resetGame}>
            {smiley}
          </button>
          <div className="digital-counter">{formatDigits(timer)}</div>
        </div>

        {/* Playfield Grid */}
        <div className="minesweeper-grid">
          {board.map((row, r) => (
            <div key={r} className="minesweeper-row">
              {row.map((cell, c) => {
                let cellClass = "minesweeper-cell";
                let cellContent = "";

                if (cell.isRevealed) {
                  cellClass += " revealed";
                  if (cell.isMine) {
                    cellClass += " mine";
                    cellContent = "💣";
                  } else if (cell.neighborMines > 0) {
                    cellClass += ` count-${cell.neighborMines}`;
                    cellContent = String(cell.neighborMines);
                  }
                } else if (cell.isFlagged) {
                  cellClass += " flagged";
                  cellContent = "🚩";
                }

                return (
                  <button
                    key={c}
                    className={cellClass}
                    onClick={() => revealCell(r, c)}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                  >
                    {cellContent}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
