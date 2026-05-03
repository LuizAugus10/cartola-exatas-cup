import './BottomNav.css';

export default function BottomNav({ currentView, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${currentView === 'team' ? 'active' : ''}`}
        onClick={() => onNavigate('team')}
      >
        <span className="nav-icon">⚽</span>
        <span className="nav-label">Escalar</span>
      </button>
      <button
        className={`nav-btn ${currentView === 'ranking' ? 'active' : ''}`}
        onClick={() => onNavigate('ranking')}
      >
        <span className="nav-icon">🏆</span>
        <span className="nav-label">Ranking</span>
      </button>
      <button
        className={`nav-btn ${currentView === 'games' ? 'active' : ''}`}
        onClick={() => onNavigate('games')}
      >
        <span className="nav-icon">📺</span>
        <span className="nav-label">Jogos</span>
      </button>
    </nav>
  );
}
