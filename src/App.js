// App.js
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accueil from './pages/Accueil';
import Games from './pages/Games';
import Results from './pages/Results';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeColor') || 'blue';
    document.body.className = ''; // Clear old classes
    document.body.classList.add(`theme-${savedTheme}`);
  }, []); // Run once on first render

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/games" element={<Games />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
