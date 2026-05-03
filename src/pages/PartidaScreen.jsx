import { useState, useEffect } from 'react';
import {
  getEventosByJogo,
  registrarEvento,
  removerEvento,
  encerrarJogo,
  getPlayers,
  getJogos,
} from '../services/api';
import Loading from '../components/Loading';
import './PartidaScreen.css';

export default function PartidaScreen({ user, jogoId, jogo, onVoltar, onToast }) {
  const [tab, setTab] = useState('registrar');
  const [jogadores, setJogadores] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [jogoAtual, setJogoAtual] = useState(jogo);
  const [loading, setLoading] = useState(true);
  const [registrando, setRegistrando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [faltasA, setFaltasA] = useState(0);
  const [faltasB, setFaltasB] = useState(0);

  useEffect(() => {
    setJogoAtual(jogo);
  }, [jogo]);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 2000);
    return () => clearInterval(interval);
  }, [jogoId]);

  const carregarDados = async () => {
    try {
      const [playersData, eventosData] = await Promise.all([
        getPlayers(),
        getEventosByJogo(jogoId),
      ]);
      setJogadores(playersData || []);
      setEventos(eventosData || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const refetchJogo = async () => {
    try {
      const jogosData = await getJogos();
      const jogoAtualizado = jogosData.find(j => j.id === jogoId);
      if (jogoAtualizado) {
        setJogoAtual(jogoAtualizado);
      }
    } catch (err) {
      console.error('Erro ao atualizar jogo:', err);
    }
  };

  const jogadoresFiltrados = jogadores.filter(
    (j) => j.time === jogoAtual.timeA || j.time === jogoAtual.timeB
  );

  const handleRegistrarEvento = async (jogadorId, tipo) => {
    try {
      // Salva estado anterior pra rollback
      const estadoAnterior = { ...jogoAtual };
      
      // Atualização otimista: só faz pra gol (que afeta placar)
      if (tipo === 'gol') {
        const jogador = jogadores.find(j => j.id === jogadorId);
        if (jogador) {
          if (jogador.time === jogoAtual.timeA) {
            setJogoAtual(prev => ({ ...prev, golsA: prev.golsA + 1 }));
          } else {
            setJogoAtual(prev => ({ ...prev, golsB: prev.golsB + 1 }));
          }
        }
      }

      // Envia pro backend
      const result = await registrarEvento(user.telefone, jogoId, jogadorId, tipo);
      
      if (result.success) {
        onToast(`${tipo} registrado!`);
        carregarDados();
        // Refetch rápido pra sincronizar com backend
        setTimeout(() => refetchJogo(), 300);
      } else {
        // Rollback se falhar
        setJogoAtual(estadoAnterior);
        onToast('Erro ao registrar evento', 'error');
      }
    } catch (err) {
      // Rollback em caso de erro de rede
      onToast('Erro de conexão', 'error');
      console.error(err);
    }
  };

  const handleRemoverEvento = async (eventoId) => {
    try {
      setDeletando(true);
      const result = await removerEvento(user.telefone, eventoId);
      if (result.success) {
        onToast('Evento removido');
        carregarDados();
        setTimeout(() => refetchJogo(), 300);
      } else {
        onToast('Erro ao remover evento', 'error');
      }
    } catch (err) {
      onToast('Erro ao remover evento', 'error');
      console.error(err);
    } finally {
      setDeletando(false);
    }
  };

  const handleEncerrar = async () => {
    if (!window.confirm('Tem certeza que quer encerrar o jogo?')) return;

    try {
      const result = await encerrarJogo(user.telefone, jogoId);
      if (result.success) {
        onToast('Jogo encerrado!');
        onVoltar();
      }
    } catch (err) {
      onToast('Erro ao encerrar jogo', 'error');
    }
  };

  if (loading) return <Loading text="Carregando partida..." />;

  return (
    <div className="partida-screen">
      <div className="partida-header">
        <button className="partida-voltar" onClick={onVoltar}>
          ← Voltar
        </button>
        <div className="partida-container">
          <div className="partida-times">
            <div className="partida-time-col">
              <span className="partida-time">{jogoAtual.timeA}</span>
              <div className="partida-faltas">
                <button onClick={() => setFaltasA(Math.max(0, faltasA - 1))}>−</button>
                <span>{faltasA}</span>
                <button onClick={() => setFaltasA(faltasA + 1)}>+</button>
              </div>
            </div>
            <span className="partida-placar">
              {jogoAtual.golsA} × {jogoAtual.golsB}
            </span>
            <div className="partida-time-col">
              <span className="partida-time">{jogoAtual.timeB}</span>
              <div className="partida-faltas">
                <button onClick={() => setFaltasB(Math.max(0, faltasB - 1))}>−</button>
                <span>{faltasB}</span>
                <button onClick={() => setFaltasB(faltasB + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>
        <button
          className="partida-btn-encerrar"
          onClick={handleEncerrar}
        >
          ✓ Encerrar
        </button>
      </div>

      <div className="partida-tabs">
        <button
          className={`partida-tab ${tab === 'registrar' ? 'active' : ''}`}
          onClick={() => setTab('registrar')}
        >
          📝 Registrar Evento
        </button>
        <button
          className={`partida-tab ${tab === 'feed' ? 'active' : ''}`}
          onClick={() => setTab('feed')}
        >
          📋 Feed ({eventos.length})
        </button>
      </div>

      {tab === 'registrar' && (
        <div className="partida-content">
          <div className="jogadores-container">
            <div className="jogadores-coluna">
              <div className="jogadores-titulo">{jogoAtual.timeA}</div>
              <div className="jogadores-list">
                {jogadoresFiltrados
                  .filter(j => j.time === jogoAtual.timeA)
                  .sort((a, b) => {
                    const ordem = { GOLEIRO: 0, PIVÔ: 1, ALA: 2, FIXO: 3 };
                    return (ordem[a.posicao] || 99) - (ordem[b.posicao] || 99);
                  })
                  .map((jogador) => (
                    <div key={jogador.id} className="jogador-card-compacto">
                      <div className="jogador-info-compacta">
                        <div className="jogador-nome-compacta">{jogador.nome}</div>
                        <div className="jogador-posicao-compacta">{jogador.posicao}</div>
                      </div>
                      <div className="jogador-acoes-compacta">
                        <button
                          className="evento-btn evento-gol"
                          onClick={() => handleRegistrarEvento(jogador.id, 'gol')}
                          title="Gol"
                        >
                          ⚽
                        </button>
                        <button
                          className="evento-btn evento-assist"
                          onClick={() => handleRegistrarEvento(jogador.id, 'assistencia')}
                          title="Assistência"
                        >
                          🅐
                        </button>
                        <button
                          className="evento-btn evento-amarelo"
                          onClick={() => handleRegistrarEvento(jogador.id, 'cartao_amarelo')}
                          title="Cartão Amarelo"
                        >
                          🟨
                        </button>
                        <button
                          className="evento-btn evento-vermelho"
                          onClick={() => handleRegistrarEvento(jogador.id, 'cartao_vermelho')}
                          title="Cartão Vermelho"
                        >
                          🟥
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="jogadores-placar">{jogoAtual.golsA} × {jogoAtual.golsB}</div>
            <div className="jogadores-coluna">
              <div className="jogadores-titulo">{jogoAtual.timeB}</div>
              <div className="jogadores-list">
                {jogadoresFiltrados
                  .filter(j => j.time === jogoAtual.timeB)
                  .sort((a, b) => {
                    const ordem = { GOLEIRO: 0, PIVÔ: 1, ALA: 2, FIXO: 3 };
                    return (ordem[a.posicao] || 99) - (ordem[b.posicao] || 99);
                  })
                  .map((jogador) => (
                    <div key={jogador.id} className="jogador-card-compacto">
                      <div className="jogador-info-compacta">
                        <div className="jogador-nome-compacta">{jogador.nome}</div>
                        <div className="jogador-posicao-compacta">{jogador.posicao}</div>
                      </div>
                      <div className="jogador-acoes-compacta">
                        <button
                          className="evento-btn evento-gol"
                          onClick={() => handleRegistrarEvento(jogador.id, 'gol')}
                          title="Gol"
                        >
                          ⚽
                        </button>
                        <button
                          className="evento-btn evento-assist"
                          onClick={() => handleRegistrarEvento(jogador.id, 'assistencia')}
                          title="Assistência"
                        >
                          🅐
                        </button>
                        <button
                          className="evento-btn evento-amarelo"
                          onClick={() => handleRegistrarEvento(jogador.id, 'cartao_amarelo')}
                          title="Cartão Amarelo"
                        >
                          🟨
                        </button>
                        <button
                          className="evento-btn evento-vermelho"
                          onClick={() => handleRegistrarEvento(jogador.id, 'cartao_vermelho')}
                          title="Cartão Vermelho"
                        >
                          🟥
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'feed' && (
        <div className="partida-content">
          <div className="eventos-feed">
            {eventos.length === 0 ? (
              <p className="eventos-empty">Nenhum evento ainda</p>
            ) : (
              eventos.map((evento) => (
                <div key={evento.id} className={`evento-item evento-${evento.tipo}`}>
                  <div className="evento-info">
                    <span className="evento-jogador">{evento.jogador}</span>
                    <span className="evento-tipo">{evento.tipo}</span>
                    <span className="evento-time">{evento.time}</span>
                  </div>
                  <button
                    className="evento-delete"
                    onClick={() => handleRemoverEvento(evento.id)}
                    disabled={deletando}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
