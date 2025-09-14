'use client'

import React, { useState } from 'react';
import './DownloadButton.css';

const DownloadButton: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 10000); // Duration of the animation
  };

  return (
    <div className="">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download
      {isAnimating && (
        <svg
          className="download-icon animate-download absolute text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="12" x2="12" y2="16" />
        </svg>
      )}
      </button>
    </div>
  );
};

export default DownloadButton;
