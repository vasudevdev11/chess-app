import React from 'react';

const Piece = ({ piece: { type, color } }) => {
  const getPieceUnicode = () => {
    const unicodeMap = {
      p: '♟',
      r: '♜',
      n: '♞',
      b: '♝',
      q: '♛',
      k: '♚',
    };
    return unicodeMap[type];
  };

  return (
    <div
      className="piece-responsive"
      style={{
        fontWeight: 'bold',
        color: color === 'w' ? 'white' : 'black',
        cursor: 'pointer',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {getPieceUnicode()}
    </div>
  );
};

export default Piece;
