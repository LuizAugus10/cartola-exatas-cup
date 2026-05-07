import { useState, useEffect } from 'react';
import { getJogos } from '../services/api';
import Loading from '../components/Loading';
import SelecaoTimes from './SelecaoTimes';
import PartidaScreen from './PartidaScreen';
import './Mesario.css';

export default function Mesario({ user, onToast }) {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jogoAbertoId, setJogoAbertoId] = useState(null);

  useEffect(() => {
    fetchJogos();
  }, []);

  const fetchJogos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getJogos();
      setJogos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar jogos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoJogo = () => {
    setJogoAbertoId('novo');
  };

  const handleEntrarJogo = (jogoId) => {
    setJogoAbertoId(jogoId);
  };

  const handleJogoCriado = (jogoId) => {
    setJogoAbertoId(jogoId);
    fetchJogos();
  };

  const handleVoltar = () => {
    setJogoAbertoId(null);
    fetchJogos();
  };

  if (loading) return <Loading text="Carregando jogos..." />;

  if (error) return <div className="mesario"><p className="mesario-error">{error}</p></div>;

  return (
    <div className="mesario">
      <div className="mesario-header">
        <h2>Gerenciar Jogos</h2>
        <button className="mesario-btn-novo" onClick={handleNovoJogo}>
          + Novo Jogo
        </button>
      </div>

      {jogoAbertoId === 'novo' && (
        <SelecaoTimes 
          user={user} 
          onJogoCriado={handleJogoCriado}
          onCancel={() => setJogoAbertoId(null)}
        />
      )}

      {!jogoAbertoId && (
        <div className="jogos-list">
          {jogos.length === 0 ? (
            <p className="jogos-empty">Nenhum jogo ainda</p>
          ) : (
            jogos.map((jogo) => (
              <div key={jogo.id} className={`jogo-card ${jogo.status}`}>
                <div className="jogo-times">
                  <span className="jogo-time">{jogo.timeA}</span>
                  <span className="jogo-vs">vs</span>
                  <span className="jogo-time">{jogo.timeB}</span>
                </div>

                {jogo.status === 'em_andamento' ? (
                  <>
                    <div className="jogo-placar">
                      {jogo.golsA} × {jogo.golsB}
                    </div>
                    <button
                      className="jogo-btn-entrar"
                      onClick={() => handleEntrarJogo(jogo.id)}
                    >
                      ▶ Abrir Partida
                    </button>
                  </>
                ) : (
                  <div className="jogo-placar-final">
                    {jogo.golsA} × {jogo.golsB}
                    <span className="jogo-finalizado">FINALIZADO</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {jogoAbertoId && jogoAbertoId !== 'novo' && (
        <PartidaScreen
          user={user}
          jogoId={jogoAbertoId}
          jogo={jogos.find(j => j.id === jogoAbertoId) || {}}
          onVoltar={handleVoltar}
          onToast={onToast}
        />
      )}
    </div>
  );
}
