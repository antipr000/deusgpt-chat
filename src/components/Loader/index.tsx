'use client';

import React from 'react';
import { ThreeDots } from 'react-loading-icons';

interface LoaderProps {
  message?: string;
  show: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show, message }) => {
  return (
    show && (
      <div
        className="fixed h-[100vh] w-[100vw] top-0 left-0 z-[10000] flex flex-col
      justify-center items-center bg-[rgba(255,255,255,0.7)]"
      >
        <ThreeDots fill="black" style={{ height: 80, width: 80 }} />
        {message && <h5 className="text-[1.5rem]">{message}</h5>}
      </div>
    )
  );
};

export default Loader;
