import React from 'react';

const SquareWrapper = ({
  children,
  position,
  black,
  inCheck,
  isSelected,
  isInvalid,
  onClick,
}) => {
  let bg = black ? 'bg-green-700' : 'bg-green-200';
  // if (isLastMove) bg = 'bg-yellow-300';
  if (isSelected) bg = 'bg-blue-400';
  if (isInvalid) bg = 'bg-red-500 animate-pulse';
  // No highlight for possible moves
  if (inCheck) bg = 'bg-red-500 animate-pulse';

  return (
    <div
      className={`flex items-center justify-center ${bg} border border-gray-400 cursor-pointer square-responsive`}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '1/1',
        boxSizing: 'border-box',
      }}
      onClick={onClick}
      data-square={position}
    >
      {children}
    </div>
  );
};

export default SquareWrapper;
