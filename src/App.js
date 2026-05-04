import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import TeamBuilder from './pages/TeamBuilder';
import Mesario from './pages/Mesario';
import Ranking from './components/Ranking';
import GamesTab from './pages/GamesTab';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('team');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('fantasyUser');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('fantasyUser');
      }
    }
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('fantasyUser', JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('fantasyUser');
    setCurrentView('team');
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  if (!user) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <Header userName={user.nome} onLogout={handleLogout} />

      {user.tipo === 'mesario' ? (
        <Mesario user={user} onToast={showToast} />
      ) : (
        <>
          {currentView === 'team' && (
            <TeamBuilder user={user} onToast={showToast} />
          )}
          {currentView === 'ranking' && (
            <Ranking userTelefone={user.telefone} />
          )}
          {currentView === 'games' && (
            <GamesTab />
          )}
        </>
      )}

      {user.tipo !== 'mesario' && (
        <BottomNav 
          currentView={currentView} 
          onNavigate={setCurrentView}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default App;
