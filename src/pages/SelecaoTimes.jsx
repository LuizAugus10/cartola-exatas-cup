import { useState, useEffect } from 'react';
import { getPlayers, criarJogo } from '../services/api';
import Loading from '../components/Loading';
import './SelecaoTimes.css';

export default function SelecaoTimes({ user, onJogoCriado, onCancel }) {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeA, setTimeA] = useState('');
  const [timeB, setTimeB] = useState('');
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    fetchTimes();
  }, []);

  const fetchTimes = async () => {
    try {
      setLoading(true);
      const players = await getPlayers();
      if (Array.isArray(players) && players.length > 0) {
        const timesUnicos = [...new Set(players.map(p => p.time))].filter(Boolean).sort();
        setTimes(timesUnicos);
      } else {
        setError('Erro ao carregar times');
      }
    } catch (err) {
      setError('Erro ao carregar times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCriar = async () => {
    if (!timeA || !timeB) {
      alert('Selecione os dois times');
      return;
    }

    if (timeA === timeB) {
      alert('Os times devem ser diferentes');
      return;
    }

    try {
      setCriando(true);
      const result = await criarJogo(user.telefone, timeA, timeB);
      if (result.success) {
        onJogoCriado(result.jogo_id);
      } else {
        setError('Erro ao criar jogo');
      }
    } catch (err) {
      setError('Erro ao criar jogo');
      console.error(err);
    } finally {
      setCriando(false);
    }
  };

  if (loading) return <Loading text="Carregando times..." />;

  return (
    <div className="selecao-times">
      <div className="selecao-header">
        <h3>Novo Jogo</h3>
        <button className="selecao-close" onClick={onCancel}>✕</button>
      </div>

      <div className="selecao-content">
        {error && <p className="selecao-error">{error}</p>}

        <div className="selecao-section">
          <label className="selecao-label">Time A</label>
          <select
            className="selecao-select"
            value={timeA}
            onChange={(e) => setTimeA(e.target.value)}
            disabled={criando}
          >
            <option value="">-- Selecione --</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="selecao-divider">VS</div>

        <div className="selecao-section">
          <label className="selecao-label">Time B</label>
          <select
            className="selecao-select"
            value={timeB}
            onChange={(e) => setTimeB(e.target.value)}
            disabled={criando}
          >
            <option value="">-- Selecione --</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="selecao-actions">
          <button
            className="selecao-btn selecao-btn-criar"
            onClick={handleCriar}
            disabled={criando || !timeA || !timeB}
          >
            {criando ? '⏳ Criando...' : '✓ Criar Jogo'}
          </button>
          <button
            className="selecao-btn selecao-btn-cancelar"
            onClick={onCancel}
            disabled={criando}
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
