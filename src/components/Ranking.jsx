import { useState, useEffect } from 'react';
import { getRanking } from '../services/api';
import Loading from './Loading';
import './Ranking.css';

export default function Ranking({ userTelefone }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRanking();
      setRanking(data);
    } catch (err) {
      setError('Erro ao carregar ranking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Carregando ranking..." />;
  if (error) return <div className="ranking-error">{error}</div>;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="ranking">
      <div className="ranking-header-bar">
        <h2>🏆 Ranking</h2>
        <button className="ranking-refresh" onClick={loadRanking}>↻</button>
      </div>

      {ranking.length === 0 ? (
        <p className="ranking-empty">Nenhum time escalado ainda</p>
      ) : (
        <div className="ranking-list">
          {ranking.map((entry, i) => (
            <div
              key={i}
              className={`ranking-item ${entry.telefone === userTelefone ? 'mine' : ''} ${i < 3 ? 'top3' : ''}`}
            >
              <span className="ranking-pos">
                {i < 3 ? medals[i] : `${i + 1}º`}
              </span>
              <span className="ranking-name">{entry.nome}</span>
              <span className="ranking-points">{entry.pontos} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
