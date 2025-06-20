import React from 'react';
import './Accueil.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

function Accueil() {
  return (
    <div className="accueil gradient-bg">
      <Navbar />

      <main className="main-content">
        <div className="content-box">
          <h1 className="logo">Color Cord</h1>
          <p className="subtitle">Entraînez votre mémoire avec des couleurs !</p>

          <div className="play-wrapper">
            <Link to="/games" className="start-button">
              Commencer le jeu <FontAwesomeIcon icon={faPlay} className="play-icon" />
            </Link>
          </div>

          <div className="color-grid four-in-row">
            <div className="color-box primary"></div>
            <div className="color-box secondary"></div>
            <div className="color-box accent"></div>
            <div className="color-box yellow"></div>
          </div>

          <div className="horizontal-section">
            <section className="features">
              <div className="feature-card">
                🎯 <h3>3 Niveaux</h3>
                <p>Facile à difficile, progressez à votre rythme</p>
              </div>
              <div className="feature-card">
                🎧 <h3>Sons personnalisés</h3>
                <p>Chaque couleur a un son unique</p>
              </div>
              <div className="feature-card">
                🌙 <h3>Thèmes variés</h3>
                <p>Personnalisez votre expérience visuelle</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Color Cord. Tous droits réservés.</p>
        <div className="social-links">
          <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
          <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
          <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
      </footer>
    </div>
  );
}

export default Accueil;
