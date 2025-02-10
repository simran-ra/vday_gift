import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft,ArrowRight } from "./icons";
import { useNavigate } from 'react-router-dom'
import {Brown,White,walkway,broke} from '../assets'

const Game = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState({ x: 6, y: 4 });
  
  // Define image sources - set to null to use shape placeholders
  const images = {
    wall: null,    // e.g. "path/to/wall.png"
    walkway: null, // e.g. "path/to/walkway.png"
    player: null,  // e.g. "path/to/player.gif"
    whiteHeart: null, // e.g. "path/to/white-heart.gif"
    blackHeart: null  // e.g. "path/to/black-heart.gif"
  };

  // Game configuration
  const rows = 10;
  const cols = 13;
  const tileSize = 40;
  
  const whiteHeartPos = { x: 11, y: 8 };
  const blackHeartPos = { x: 1, y: 1 };
  
  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // Load all images and store them
  const loadImages = async () => {
    const loadedImages = {};
    for (const [key, src] of Object.entries(images)) {
      if (src) {
        try {
          const img = new Image();
          img.src = src;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          loadedImages[key] = img;
        } catch (error) {
          console.warn(`Failed to load ${key} image, using shape placeholder`);
          loadedImages[key] = null;
        }
      }
    }
    return loadedImages;
  };

  // Shape drawing functions (placeholders)
  const drawShapes = {
    wall: (ctx, x, y) => {
      ctx.fillStyle = '#ff9eaf';
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.strokeStyle = '#ffd1d9';
      ctx.strokeRect(x, y, tileSize, tileSize);
    },
    
    walkway: (ctx, x, y) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, tileSize, tileSize);
      ctx.strokeStyle = '#ffd1d9';
      ctx.strokeRect(x, y, tileSize, tileSize);
    },
    
    player: (ctx, x, y) => {
      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      ctx.arc(x + tileSize/2, y + tileSize/2, tileSize/3, 0, Math.PI * 2);
      ctx.fill();
    },
    
    heart: (ctx, x, y, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      const centerX = x + tileSize/2;
      const centerY = y + tileSize/2;
      const size = tileSize/2;
      
      ctx.moveTo(centerX, centerY + size/4);
      ctx.bezierCurveTo(
        centerX, centerY,
        centerX - size, centerY,
        centerX - size, centerY + size/2
      );
      ctx.bezierCurveTo(
        centerX - size, centerY + size * 1.5,
        centerX, centerY + size * 1.5,
        centerX, centerY + size * 1.5
      );
      ctx.bezierCurveTo(
        centerX, centerY + size * 1.5,
        centerX + size, centerY + size * 1.5,
        centerX + size, centerY + size/2
      );
      ctx.bezierCurveTo(
        centerX + size, centerY,
        centerX, centerY,
        centerX, centerY + size/4
      );
      ctx.fill();
    }
  };

  const drawMaze = async (ctx) => {
    const loadedImages = await loadImages();
    ctx.clearRect(0, 0, cols * tileSize, rows * tileSize);

    // Draw maze tiles
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tileX = x * tileSize;
        const tileY = y * tileSize;
        
        if (maze[y][x] === 1) {
          if (loadedImages.wall) {
            ctx.drawImage(loadedImages.wall, tileX, tileY, tileSize, tileSize);
          } else {
            drawShapes.wall(ctx, tileX, tileY);
          }
        } else {
          if (loadedImages.walkway) {
            ctx.drawImage(loadedImages.walkway, tileX, tileY, tileSize, tileSize);
          } else {
            drawShapes.walkway(ctx, tileX, tileY);
          }
        }
      }
    }

    // Draw hearts
    if (loadedImages.whiteHeart) {
      ctx.drawImage(loadedImages.whiteHeart, 
        whiteHeartPos.x * tileSize, whiteHeartPos.y * tileSize, 
        tileSize, tileSize);
    } else {
      drawShapes.heart(ctx, whiteHeartPos.x * tileSize, whiteHeartPos.y * tileSize, '#ffffff');
    }

    if (loadedImages.blackHeart) {
      ctx.drawImage(loadedImages.blackHeart, 
        blackHeartPos.x * tileSize, blackHeartPos.y * tileSize, 
        tileSize, tileSize);
    } else {
      drawShapes.heart(ctx, blackHeartPos.x * tileSize, blackHeartPos.y * tileSize, '#333333');
    }

    // Draw player
    if (loadedImages.player) {
      ctx.drawImage(loadedImages.player, 
        player.x * tileSize, player.y * tileSize, 
        tileSize, tileSize);
    } else {
      drawShapes.player(ctx, player.x * tileSize, player.y * tileSize);
    }
  };

  const movePlayer = (dx, dy) => {
    if (!gameStarted) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (
      newX >= 0 &&
      newX < cols &&
      newY >= 0 &&
      newY < rows &&
      maze[newY][newX] === 0
    ) {
      setPlayer({ x: newX, y: newY });

      if (newX === whiteHeartPos.x && newY === whiteHeartPos.y) {
        window.location.href = "valentine-success.html";
      }

      if (newX === blackHeartPos.x && newY === blackHeartPos.y) {
        setGameOver(true);
        setGameStarted(false);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setPlayer({ x: 6, y: 4 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    
    drawMaze(ctx);
  }, [player]);

  const ControlButton = ({ onClick, children, className }) => (
    <button
      onClick={onClick}
      className={`w-16 h-16 bg-pink-400 text-white rounded-full shadow-lg active:bg-pink-500 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 bg-[url('https://i.imgur.com/nVVaZgV.jpg')] bg-center bg-no-repeat bg-cover font-['Press_Start_2P'] p-4">
      <h1 className="text-2xl md:text-4xl text-pink-400 mb-5 shadow-text text-center">Will You Be My Valentine?</h1>
      
      {!gameStarted && !gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-100/90 p-5 rounded-lg shadow-lg text-center">
          <h1 className="text-xl mb-4">Valentine's Maze</h1>
          <button
            onClick={startGame}
            className="bg-pink-400 text-white px-5 py-2 rounded hover:bg-pink-500 transition-colors"
          >
            Start Game
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-100/90 p-5 rounded-lg shadow-lg text-center">
          <h1 className="text-xl mb-4">Game Over!</h1>
          <button
            onClick={startGame}
            className="bg-pink-400 text-white px-5 py-2 rounded hover:bg-pink-500 transition-colors"
          >
            Restart
          </button>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="bg-white rounded-lg border-4 border-pink-300 shadow-lg mt-5"
      />

      {gameStarted && (
        <div className="mt-8 relative w-52 h-52">
          <ControlButton
            onClick={() => movePlayer(0, -1)}
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
          >
            ↑
          </ControlButton>
          <ControlButton
            onClick={() => movePlayer(-1, 0)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
          >
            ←
          </ControlButton>
          <ControlButton
            onClick={() => movePlayer(1, 0)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
          >
            →
          </ControlButton>
          <ControlButton
            onClick={() => movePlayer(0, 1)}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          >
            ↓
          </ControlButton>
        </div>
      )}
    </div>
  );
};

export default Game;