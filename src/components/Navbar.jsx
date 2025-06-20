import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Color Cord</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/settings">Configuration</Link>
        <Link to="/results">Résultats</Link>
        <Link to="/games">
          <button className="play-btn">Jouer</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
