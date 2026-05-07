import { useState, useMemo } from 'react';
import './NewGameModal.css';

export default function NewGameModal({
  isOpen,
  onClose,
  teams,
  onSubmit
}) {
  const [selectedTimeA, setSelectedTimeA] = useState('');
  const [selectedTimeB, setSelectedTimeB] = useState('');
  const [selectedFase, setSelectedFase] = useState('grupo');
  const [error, setError] = useState('');

  const faseOptions = [
    { value: 'grupo', label: 'Grupo' },
    { value: 'semi', label: 'Semifinal' },
    { value: 'terceiro', label: 'Terceiro Lugar' },
    { value: 'final', label: 'Final' }
  ];

  const teamsA = useMemo(() => {
    return teams ? [...new Set(teams)].sort() : [];
  }, [teams]);

  const teamsB = useMemo(() => {
    return teamsA.filter(t => t !== selectedTimeA);
  }, [teamsA, selectedTimeA]);

  const handleSubmit = () => {
    setError('');

    if (!selectedTimeA) {
      setError('Selecione o Time A');
      return;
    }

    if (!selectedTimeB) {
      setError('Selecione o Time B');
      return;
    }

    if (selectedTimeA === selectedTimeB) {
      setError('Times não podem ser iguais');
      return;
    }

    onSubmit(selectedTimeA, selectedTimeB, selectedFase);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTimeA('');
    setSelectedTimeB('');
    setSelectedFase('grupo');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="ngm-overlay" onClick={handleClose}>
      <div className="ngm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ngm-close" onClick={handleClose}>✕</button>

        <div className="ngm-header">
          <h2>Criar Novo Jogo</h2>
        </div>

        <div className="ngm-content">
          {/* Time A */}
          <div className="ngm-section">
            <label className="ngm-label">Time A</label>
            <select
              className="ngm-select"
              value={selectedTimeA}
              onChange={(e) => setSelectedTimeA(e.target.value)}
            >
              <option value="">Selecione um time...</option>
              {teamsA.map((team) => (
                <option key={team} value={team}>
                  {team.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Time B */}
          <div className="ngm-section">
            <label className="ngm-label">Time B</label>
            <select
              className="ngm-select"
              value={selectedTimeB}
              onChange={(e) => setSelectedTimeB(e.target.value)}
              disabled={!selectedTimeA}
            >
              <option value="">Selecione um time...</option>
              {teamsB.map((team) => (
                <option key={team} value={team}>
                  {team.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Fase */}
          <div className="ngm-section">
            <label className="ngm-label">Fase</label>
            <div className="ngm-fase-options">
              {faseOptions.map((opt) => (
                <label key={opt.value} className="ngm-radio-label">
                  <input
                    type="radio"
                    name="fase"
                    value={opt.value}
                    checked={selectedFase === opt.value}
                    onChange={(e) => setSelectedFase(e.target.value)}
                  />
                  <span className="ngm-radio-text">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <div className="ngm-error">{error}</div>}
        </div>

        {/* Buttons */}
        <div className="ngm-actions">
          <button className="ngm-btn ngm-btn-criar" onClick={handleSubmit}>
            ✓ Criar Jogo
          </button>
          <button className="ngm-btn ngm-btn-cancelar" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
