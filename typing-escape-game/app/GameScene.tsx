"use client";
import React from 'react';

const GameScene: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f2c021]">
      {/* Background elements can go here */}
      
      {/* Man running animation */}
      <img src="/man-running.png" alt="Running Man" className="absolute bottom-10 left-[75%] transform -translate-x-1/2 w-64 h-[512px] animate-run" /> {/* Placeholder for man image */}

      {/* Dogs chasing animation */}
      <img src="/dog-chasing-2.png" alt="Chasing Dog 2" className="absolute bottom-10 left-[25%] w-48 h-96 animate-chase" /> {/* Placeholder for dog 2 image */}

      {/* Basic CSS animation definitions (will need refinement in globals.css or a dedicated CSS file) */}
      <style jsx>{`
        @keyframes run {
          0% { transform: translateX(0); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        @keyframes chase {
          0% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-run {
          animation: run 1s infinite linear;
        }
        .animate-chase {
          animation: chase 1.2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default GameScene;