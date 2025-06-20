import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, X } from 'lucide-react';
import React from 'react';
import Navbar from '../components/Navbar';
import './Games.css';

import menu1 from '../assets/sounds/menu-1.mp3';
import menu2 from '../assets/sounds/menu-2.mp3';
import menu3 from '../assets/sounds/menu-3.mp3';

import redSoundSrc from '../assets/sounds/red.wav';
import greenSoundSrc from '../assets/sounds/green.wav';
import yellowSoundSrc from '../assets/sounds/yellow.wav';
import blueSoundSrc from '../assets/sounds/blue.wav';

// Stable color list
const colorList = [
  { id: 'red', sound: new Audio(redSoundSrc) },
  { id: 'green', sound: new Audio(greenSoundSrc) },
  { id: 'yellow', sound: new Audio(yellowSoundSrc) },
  { id: 'blue', sound: new Audio(blueSoundSrc) },
];

export default function GameScreen() {
  const difficultySettings = {
    easy: { initialLevel: 1, showDelay: 1000 },
    medium: { initialLevel: 2, showDelay: 800 },
    hard: { initialLevel: 3, showDelay: 600 },
  };

  const [difficulty] = useState(() => localStorage.getItem('difficulty') || 'medium');
  const [theme] = useState(() => localStorage.getItem('themeColor') || 'blue');
  const currentSettings = difficultySettings[difficulty];

  const [level, setLevel] = useState(currentSettings.initialLevel);
  const [score, setScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState('showing');
  const [soundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');

  const colors = useRef(colorList).current;

  const getMenuMusic = (theme) => {
    if (theme === 'pink') return menu2;
    if (theme === 'dark') return menu3;
    return menu1;
  };

  const menuAudio = useRef(new Audio(getMenuMusic(theme)));

  useEffect(() => {
    if (soundEnabled) {
      menuAudio.current.loop = true;
      menuAudio.current.volume = 0.2;
      menuAudio.current.play().catch((e) => console.warn('Menu sound play error:', e.message));
    }
    return () => {
      menuAudio.current.pause();
      menuAudio.current.currentTime = 0;
    };
  }, [soundEnabled]);

  const generateSequence = useCallback(() => {
    const newSequence = [];
    for (let i = 0; i < level + 1; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)].id;
      newSequence.push(randomColor);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
  }, [level, colors]);

  useEffect(() => {
    generateSequence();
  }, [generateSequence]);

  useEffect(() => {
    if (gameState === 'showing' && sequence.length > 0) {
      let i = 0;
      const highlightDuration = Math.min(currentSettings.showDelay * 0.6, 500);

      const interval = setInterval(() => {
        if (i < sequence.length) {
          const currentColor = sequence[i];
          setActiveColor(currentColor);

          if (soundEnabled) {
            const sound = colors.find(c => c.id === currentColor)?.sound;
            sound.currentTime = 0;
            sound.play().catch((e) => console.warn(`Sound play error for ${currentColor}:`, e.message));
          }

          setTimeout(() => {
            setActiveColor(null);
          }, highlightDuration);

          i++;
        } else {
          clearInterval(interval);
          setGameState('playing');
        }
      }, currentSettings.showDelay);
      return () => clearInterval(interval);
    }
  }, [gameState, sequence, soundEnabled, colors, currentSettings.showDelay]);

  const handleColorClick = (colorId) => {
    if (gameState !== 'playing') return;

    setActiveColor(colorId);
    if (soundEnabled) {
      const sound = colors.find(c => c.id === colorId)?.sound;
      sound?.play().catch((e) => console.warn(`Sound play error for ${colorId}:`, e.message));
    }
    setTimeout(() => setActiveColor(null), 300);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      const newResult = {
        score,
        date: new Date().toISOString(),
      };

      const existingResults = JSON.parse(localStorage.getItem('gameResults')) || [];
      const updatedResults = [newResult, ...existingResults].slice(0, 10);
      localStorage.setItem('gameResults', JSON.stringify(updatedResults));

      setGameState('gameover');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + level * 10);
      setLevel(level + 1);
      generateSequence();
    }
  };

  const restartGame = () => {
    setLevel(currentSettings.initialLevel);
    setScore(0);
    generateSequence();
  };

  return (
    <div className={`games-screen theme-${theme}`}>
      <Navbar />

      <div className="games-container">
        <div className="game-header">
          <div>Niveau <span className="level">{level}</span></div>
          <div>Score: <span className="score">{score}</span></div>
        </div>

        <div className="instructions">
          {gameState === 'showing' ? 'Regardez la séquence!' : 'Répétez la séquence!'}
        </div>

        <div className="color-grid">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              disabled={gameState !== 'playing'}
              className={`color-button ${color.id} ${activeColor === color.id ? 'active' : ''}`}
              aria-label={color.id}
            />
          ))}
        </div>

        <div className="control-buttons">
          <button onClick={restartGame} className="control-button">
            <RotateCcw className="w-5 h-5 mr-2" />
            Recommencer
          </button>
          <button onClick={() => (window.location.href = '/')} className="control-button">
            <X className="w-5 h-5 mr-2" />
            Quitter
          </button>
        </div>

        {gameState === 'gameover' && (
          <div className="modal">
            <div className="modal-content">
              <h2>Game Over!</h2>
              <p className="final-score">Votre score final: <span className="font-bold">{score}</span></p>
              <div className="button-row">
                <button onClick={restartGame} className="control-button">Rejouer</button>
                <button onClick={() => (window.location.href = '/')} className="control-button">Menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
