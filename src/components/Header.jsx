import './Header.css';

export default function Header({ userName, onLogout }) {
  return (
    <header className="header">
      <div className="header-title">
        <span className="header-icon">⚽</span>
        <h1>Fantasy Exatas Cup</h1>
      </div>
      {userName && (
        <div className="header-user">
          <span className="header-name">{userName}</span>
          <button className="header-logout" onClick={onLogout}>Sair</button>
        </div>
      )}
    </header>
  );
}
