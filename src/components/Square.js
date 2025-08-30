import React from 'react';

const Square = ({ children, black, inCheck }) => {
  let bgClass = black ? 'bg-gray-600' : 'bg-gray-200';
  if (inCheck) {
    bgClass = 'bg-red-500 animate-pulse';
  }
  return (
    <div className={`${bgClass} w-full h-full flex justify-center items-center`}>
      {children}
    </div>
  );
};

export default Square;