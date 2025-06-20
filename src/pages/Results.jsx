import React, { useEffect, useState } from 'react';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Results.css';
import { useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [highScore, setHighScore] = useState(0);

  const playerName = "Player"; // static for now

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('gameResults')) || [];

    // Filter out invalid or incomplete entries
    const validResults = storedResults.filter(
      (res) => typeof res.score === 'number' && typeof res.date === 'string'
    );

    // Compute high score
    const topScore = validResults.reduce((max, res) => Math.max(max, res.score), 0);

    // Mark the highest scoring result
    const updatedResults = validResults.map((res, index) => ({
      id: index + 1,
      ...res,
      isHighScore: res.score === topScore
    }));

    setResults(updatedResults);
    setHighScore(topScore);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Date inconnue';
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="results-page">
      <Navbar />

      <main className="results-container">
        <h1 className="results-title">Résultats</h1>
        <div className="player-name">
          <Trophy className="icon" />
          <p><strong>{playerName}</strong></p>
        </div>

        <section className="score-card">
          <div className="score-info">
            <h2>Meilleur score</h2>
            <p className="score-value">{highScore}</p>
          </div>
          <div className="score-icon">
            <Star className="star-icon" fill="white" />
          </div>
        </section>

        <section className="history">
          <h2>Historique des parties</h2>
          {results.length === 0 ? (
            <p>Aucune partie enregistrée.</p>
          ) : (
            results.map((attempt) => (
              <div
                key={attempt.id}
                className={`attempt ${attempt.isHighScore ? 'highlight' : ''}`}
              >
                <span>{formatDate(attempt.date)}</span>
                <span className="score">
                  {attempt.score}
                  {attempt.isHighScore && <Star className="mini-star" fill="#F59E0B" />}
                </span>
              </div>
            ))
          )}
        </section>

        <div className="actions">
          <button className="btn-primary" onClick={() => navigate('/games')}>
            <RotateCcw className="btn-icon" /> Rejouer
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <Home className="btn-icon" /> Retour à l'accueil
          </button>
        </div>

        <p className="motivation">
          "Continue comme ça! Ton prochain record est à portée de main."
        </p>
      </main>
    </div>
  );
}
