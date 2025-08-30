import React, { useState, useRef } from 'react';
import { Chess } from 'chess.js';
import SquareWrapper from './SquareWrapper';
import Piece from './Piece';

// Sound effect files (you'll need to add these to your public folder)
const moveSound = new window.Audio(process.env.PUBLIC_URL + '/move.mp3');
const captureSound = new window.Audio(process.env.PUBLIC_URL + '/capture.mp3');

const Board = () => {
  const gameRef = useRef(new Chess());
  const [, setForceRender] = useState(0);
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [invalidSquare, setInvalidSquare] = useState(null);

  const getKingInCheckSquare = () => {
    const game = gameRef.current;
    if (!game.inCheck()) return null;
    const turn = game.turn();
    const board = game.board();
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return String.fromCharCode(97 + x) + (8 - y);
        }
      }
    }
    return null;
  };

  // Handle click-to-move logic
  const handleSquareClick = (square) => {
    const game = gameRef.current;
    if (selected) {
      // Only allow if the move is legal
      if (possibleMoves.includes(square)) {
        // Check if this is a capture
        const targetPiece = game.get(square);
        const move = game.move({ from: selected, to: square, promotion: 'q' });
        if (move) {
          if (targetPiece) {
            captureSound.currentTime = 0;
            captureSound.play();
          } else {
            moveSound.currentTime = 0;
            moveSound.play();
          }
          setSelected(null);
          setPossibleMoves([]);
          setForceRender(n => n + 1);
        }
      } else {
        // If clicking another piece of the same color, select it
        if (game.get(square) && game.get(square).color === game.turn()) {
          setSelected(square);
          setPossibleMoves(game.moves({ square, verbose: true }).map(m => m.to));
        } else {
          setInvalidSquare(square);
          setTimeout(() => setInvalidSquare(null), 400);
          setSelected(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select if piece of current turn
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        setPossibleMoves(game.moves({ square, verbose: true }).map(m => m.to));
      }
    }
  };

  const handleRestart = () => {
    gameRef.current.reset();
    setSelected(null);
    setPossibleMoves([]);
    setForceRender(n => n + 1);
  };

  const handleUndo = () => {
    gameRef.current.undo();
    setSelected(null);
    setPossibleMoves([]);
    setForceRender(n => n + 1);
  };

  const renderSquare = (i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const black = (x + y) % 2 === 1;
    const square = String.fromCharCode(97 + x) + (8 - y);
    const piece = gameRef.current.get(square);
    const kingInCheckSquare = getKingInCheckSquare();
    const inCheck = kingInCheckSquare === square;
    const isSelected = selected === square;
  // const isPossibleMove = possibleMoves.includes(square);

    const isInvalid = invalidSquare === square;
    return (
      <SquareWrapper
        key={i}
        position={square}
        black={black}
        inCheck={inCheck}
        isSelected={isSelected}
        isInvalid={isInvalid}
        onClick={() => handleSquareClick(square)}
      >
        {piece ? <Piece piece={piece} position={square} /> : null}
      </SquareWrapper>
    );
  };

  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i));
  }

  const turn = gameRef.current.turn() === 'w' ? 'White' : 'Black';
  const game = gameRef.current;
  const isCheckmate = typeof game.in_checkmate === 'function' ? game.in_checkmate() : false;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        overflow: 'hidden',
        marginTop: '8px',
        background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
      }}
    >
      {isCheckmate && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-white/90 border-2 border-red-500 rounded-2xl shadow-2xl px-12 py-8 flex flex-col items-center">
            <span className="text-3xl font-bold text-red-600 mb-4 drop-shadow">Checkmate!</span>
            <span className="text-lg font-semibold text-gray-800 mb-2">{turn === 'White' ? 'Black' : 'White'} wins!</span>
            <button
              onClick={handleRestart}
              className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-6 py-2 rounded-xl text-base font-semibold shadow transition-all duration-200"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-4 w-full px-2 md:px-0">
        <div
          className="flex flex-col items-start gap-4 mt-4 lg:mt-8 p-2 md:p-2 lg:p-4 rounded-2xl shadow-xl bg-white/30 backdrop-blur-md border border-white/40 w-full max-w-[160px] md:max-w-[180px] lg:max-w-[200px] lg:ml-16"
          style={{ minWidth: 120 }}
        >
          <span className="font-bold text-base md:text-lg lg:text-xl text-gray-800 drop-shadow mb-2 tracking-wide">Chess Menu</span>
          <span className="font-semibold text-sm md:text-base lg:text-lg text-gray-700">Turn: <span className="text-blue-700">{turn}</span></span>
          <button
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-sm lg:text-base font-semibold shadow transition-all duration-200 mb-2"
          >
            Restart
          </button>
          <button
            onClick={handleUndo}
            className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-sm lg:text-base font-semibold shadow transition-all duration-200"
          >
            Undo
          </button>
        </div>
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-700 bg-gradient-to-br from-green-200 to-green-500 mx-auto board-responsive"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          {squares}
        </div>
      </div>
    </div>
  );
};

export default Board;
