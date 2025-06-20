import { useState, useEffect } from 'react';
import { Gauge, Volume2, VolumeX, Palette, Settings as SettingsIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Settings.css';

export default function SettingsContainer() {
  // Settings.jsx (only show the modified lines here)
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('difficulty') || 'medium');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'blue');


  // ✅ Load from localStorage on first render
  useEffect(() => {
    const savedDifficulty = localStorage.getItem('difficulty');
    const savedSound = localStorage.getItem('soundEnabled');
    const savedTheme = localStorage.getItem('themeColor');

    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedTheme) {
      setThemeColor(savedTheme);
      document.body.className = ''; // clear existing
      document.body.classList.add(`theme-${savedTheme}`); // apply new theme to <body>
    }
  }, []);

  // ✅ Persist and apply when value changes
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('themeColor', themeColor);

    document.body.className = ''; // remove old theme
    document.body.classList.add(`theme-${themeColor}`); // apply current theme
  }, [difficulty, soundEnabled, themeColor]);

  const handleDifficultyChange = (e) => setDifficulty(e.target.value);
  const toggleSound = () => setSoundEnabled(!soundEnabled);
  const handleThemeChange = (color) => setThemeColor(color);

  return (
    <div className={`settings-page theme-${themeColor}`}>
      <Navbar />
      <main className="settings-container">
        <h1 className="settings-title">
          <SettingsIcon className="icon" />
          Paramètres du jeu
        </h1>

        {/* Difficulté */}
        <section className="settings-block">
          <div className="settings-header">
            <Gauge className="icon" />
            <h2>Difficulté</h2>
          </div>
          <div className="radio-group">
            {["easy", "medium", "hard"].map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={handleDifficultyChange}
                />
                {level === "easy" ? "Facile" : level === "medium" ? "Moyen" : "Difficile"}
              </label>
            ))}
          </div>
        </section>

        {/* Son */}
        <section className="settings-block">
          <div className="settings-header">
            {soundEnabled ? <Volume2 className="icon" /> : <VolumeX className="icon" />}
            <h2>Son</h2>
          </div>
          <button onClick={toggleSound} className={`toggle-btn ${soundEnabled ? 'on' : 'off'}`}>
            <span className="toggle-dot" />
          </button>
        </section>

        {/* Thème */}
        <section className="settings-block">
          <div className="settings-header">
            <Palette className="icon" />
            <h2>Couleur du thème</h2>
          </div>
          <div className="color-options">
            <button className={`color-circle blue ${themeColor === 'blue' ? 'active' : ''}`} onClick={() => handleThemeChange('blue')} />
            <button className={`color-circle pink ${themeColor === 'pink' ? 'active' : ''}`} onClick={() => handleThemeChange('pink')} />
            <button className={`color-circle dark ${themeColor === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')} />
          </div>
        </section>
      </main>
    </div>
  );
}
