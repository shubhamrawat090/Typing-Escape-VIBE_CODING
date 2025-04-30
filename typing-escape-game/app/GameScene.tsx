"use client";
import React, { useState, useEffect, useRef } from 'react';

const words = ["escape", "danger", "run", "quick", "chase", "survive", "fast", "panic"]; // Simple word list

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

const GameScene: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [bittenCount, setBittenCount] = useState<number>(0);
  const [isTypingTime, setIsTypingTime] = useState<boolean>(false);
  const [manPosition, setManPosition] = useState<number>(75); // Percentage from left
  const [dogPosition, setDogPosition] = useState<number>(25); // Percentage from left

  const wordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to reset the game state
  const resetGame = () => {
    setBittenCount(0);
    setDogPosition(25);
    setManPosition(75);
    setCurrentWord('');
    setUserInput('');
    setTimeLeft(0);
    setIsTypingTime(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (wordIntervalRef.current) clearInterval(wordIntervalRef.current); // Clear existing interval
  };

  // Function to start a new word challenge
  const startWordChallenge = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setUserInput('');
    setTimeLeft(5); // 5 seconds to type
    setIsTypingTime(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Clear previous typing timeout if any
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout for typing
    typingTimeoutRef.current = setTimeout(() => {
      handleMiss();
    }, 5000);
  };

  // Handle successful typing
  const handleSuccess = () => {
    setIsTypingTime(false);
    setCurrentWord('');
    setUserInput('');
    setTimeLeft(0);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Optionally, move dog slightly back or keep distance
  };

  // Handle missed word or timeout
  const handleMiss = () => {
    setIsTypingTime(false);
    setCurrentWord('');
    setUserInput('');
    setTimeLeft(0);
    setBittenCount((prev) => prev + 1);
    // Move dog closer to man
    setDogPosition((prev) => Math.min(prev + 5, manPosition - 5)); // Dog moves closer, ensure it doesn't overlap initially
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  // Timer for word generation (every 10 seconds)
  useEffect(() => {
    // Function to start the game loop
    const startGameLoop = () => {
      startWordChallenge(); // Start the first challenge
      wordIntervalRef.current = setInterval(() => {
        if (!isTypingTime) { // Only start a new challenge if not already in one
          startWordChallenge();
        }
      }, 10000); // New word every 10 seconds
    };

    if (bittenCount < 5) {
      startGameLoop(); // Start the loop if the game is not over
    }

    return () => {
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [bittenCount]); // Rerun when bittenCount changes (e.g., after restart)

  // Countdown timer effect when typing time is active
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    if (isTypingTime && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTypingTime) {
      // Time ran out, handled by the typingTimeoutRef
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isTypingTime, timeLeft]);

  // Handle user input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = event.target.value;
    setUserInput(typedValue);

    if (typedValue === currentWord) {
      handleSuccess();
    }
  };

  // Basic check for game over (bitten 5 times)
  useEffect(() => {
    if (bittenCount >= 5) { // Game over when bitten 5 times
      // Game Over logic - stop intervals, show message, etc.
      if (wordIntervalRef.current) clearInterval(wordIntervalRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setIsTypingTime(false);
      // You might want to display a proper game over message here
      console.log("Game Over!");
    }
  }, [bittenCount]);


  // Function to handle game restart
  const handleRestart = () => {
    resetGame();
    // The useEffect watching bittenCount will restart the game loop
  };


  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f2c021]">
      {/* Man running animation - Position controlled by state */}
      <img
        src="/man-running.png"
        alt="Running Man"
        className="absolute bottom-10 transform -translate-x-1/2 h-[425px] transition-all duration-500 ease-linear"
        style={{ left: `${manPosition}%` }}
      />

      {/* Dog chasing animation - Position controlled by state */}
      <img
        src="/dog-chasing-2.png"
        alt="Chasing Dog"
        className="absolute bottom-10 transform -translate-x-1/2 h-[425px] transition-all duration-500 ease-linear"
        style={{ left: `${dogPosition}%` }}
      />

      {/* Word display and input area */}
      {isTypingTime && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg text-center">
          <p className="text-2xl font-bold mb-2">Type the word:</p>
          <p className="text-4xl font-mono mb-4">{currentWord}</p>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="border-2 border-gray-400 p-2 rounded w-full text-center text-xl"
            autoFocus
            disabled={!isTypingTime}
          />
          <p className="text-lg mt-2">Time left: {timeLeft}s</p>
        </div>
      )}

      {/* Bitten count display */}
      <div className="absolute top-5 right-5 bg-red-500 text-white p-3 rounded shadow-lg">
        <p className="text-xl font-bold">Bitten: {bittenCount}</p>
      </div>

      {/* Game Over Message */}
      {bittenCount >= 5 && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <p className="text-white text-6xl font-bold mb-8">GAME OVER!</p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-blue-500 text-white text-2xl font-bold rounded hover:bg-blue-700 transition duration-300"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScene;