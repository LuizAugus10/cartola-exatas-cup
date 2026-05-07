import { useState, useEffect } from 'react';
import { getJogos, criarJogo, getPlayers } from '../services/api';
import Loading from '../components/Loading';
import NewGameModal from '../components/NewGameModal';
import './GamesTab.css';

export default function GamesTab({ user, onToast }) {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('finalizado');
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchJogos();
    loadTeams();
    const interval = setInterval(fetchJogos, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTeams = async () => {
    try {
      const playersData = await getPlayers();
      const teamsList = [...new Set(playersData.map(p => p.time))];
      setTeams(teamsList);
    } catch (err) {
      console.error('Erro ao carregar times:', err);
    }
  };

  const fetchJogos = async () => {
    try {
      const data = await getJogos();
      setJogos(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar jogos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoJogo = async (timeA, timeB, fase) => {
    try {
      const result = await criarJogo(user.telefone, timeA, timeB, fase);
      if (result.success) {
        onToast('Jogo criado com sucesso!');
        fetchJogos();
      } else {
        onToast('Erro ao criar jogo', 'error');
      }
    } catch (err) {
      onToast('Erro ao criar jogo', 'error');
      console.error(err);
    }
  };

  const jogosFiltrados = jogos.filter(jogo => {
    if (filterStatus === 'finalizado') {
      return jogo.status === 'finalizado';
    }
    return jogo.status === 'em_andamento';
  });

  if (loading) return <Loading text="Carregando jogos..." />;

  return (
    <div className="games-tab">
      <div className="games-header">
        <h2>Jogos</h2>
        {user && user.tipo === 'mesario' && (
          <button 
            className="btn-novo-jogo"
            onClick={() => setShowNewGameModal(true)}
          >
            ➕ Novo Jogo
          </button>
        )}
        <button 
          className={`filter-btn ${filterStatus === 'finalizado' ? 'active' : ''}`}
          onClick={() => setFilterStatus('finalizado')}
        >
          Finalizados
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'em_andamento' ? 'active' : ''}`}
          onClick={() => setFilterStatus('em_andamento')}
        >
          Ao Vivo
        </button>
      </div>

      {error && <p className="games-error">{error}</p>}

      {jogosFiltrados.length === 0 ? (
        <div className="games-empty">
          <p>Nenhum jogo {filterStatus === 'finalizado' ? 'finalizado' : 'em andamento'}</p>
        </div>
      ) : (
        <div className="games-list">
          {jogosFiltrados.map((jogo) => (
            <div 
              key={jogo.id} 
              className={`game-card ${jogo.status}`}
            >
              <div className="game-content">
                <div className="game-team game-team-a">
                  <span className="game-team-name">{jogo.timeA}</span>
                </div>

                <div className="game-score">
                  <div className="game-placar">
                    {jogo.golsA} × {jogo.golsB}
                  </div>
                  {jogo.status === 'em_andamento' && (
                    <span className="game-live">🔴 AO VIVO</span>
                  )}
                  {jogo.status === 'finalizado' && (
                    <span className="game-finished">Finalizado</span>
                  )}
                </div>

                <div className="game-team game-team-b">
                  <span className="game-team-name">{jogo.timeB}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewGameModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        teams={teams}
        onSubmit={handleNovoJogo}
      />
    </div>
  );
}
