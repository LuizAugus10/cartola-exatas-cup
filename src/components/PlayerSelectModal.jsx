import { useState, useMemo } from 'react';
import PlayerCard from './PlayerCard';
import PlayerStatsModal from './PlayerStatsModal';
import './PlayerSelectModal.css';

export default function PlayerSelectModal({
  players,
  selectedIds,
  positionFilter,
  onSelect,
  onRemove,
  onClose,
  currentPlayer,
}) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [statsPlayer, setStatsPlayer] = useState(null);

  const teams = useMemo(() => {
    const t = [...new Set(players.filter((p) => p.posicao === positionFilter).map((p) => p.time))];
    t.sort();
    return t;
  }, [players, positionFilter]);

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (p.posicao !== positionFilter) return false;
      if (teamFilter && p.time !== teamFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.nome.toLowerCase().includes(s) || p.time.toLowerCase().includes(s);
      }
      return true;
    });
  }, [players, positionFilter, teamFilter, search]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h3>Escolher {positionFilter === 'goleiro' ? 'Goleiro' : 'Jogador de Linha'}</h3>
          {currentPlayer && onRemove && (
            <button className="modal-remove-btn" onClick={onRemove}>
              Remover
            </button>
          )}
        </div>

        <div className="modal-filters">
          <input
            className="modal-search"
            type="text"
            placeholder="🔍 Buscar jogador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="modal-teams">
            <button
              className={`team-chip ${!teamFilter ? 'active' : ''}`}
              onClick={() => setTeamFilter('')}
            >
              Todos
            </button>
            {teams.map((t) => (
              <button
                key={t}
                className={`team-chip ${teamFilter === t ? 'active' : ''}`}
                onClick={() => setTeamFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-players">
          {filtered.length === 0 ? (
            <p className="modal-empty">Nenhum jogador encontrado</p>
          ) : (
            filtered.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                onSelect={onSelect}
                onViewStats={(player) => setStatsPlayer(player)}
                disabled={selectedIds.has(p.id) && currentPlayer?.id !== p.id}
                selected={currentPlayer?.id === p.id}
                showStats={false}
              />
            ))
          )}  
        </div>

        <PlayerStatsModal 
          player={statsPlayer} 
          onClose={() => setStatsPlayer(null)}
          isSelecting={true}
          isSelected={statsPlayer ? selectedIds.has(statsPlayer.id) : false}
          onAddPlayer={() => {
            if (statsPlayer) {
              onSelect(statsPlayer);
              setStatsPlayer(null);
            }
          }}
          onRemovePlayer={() => {
            if (statsPlayer && onRemove) {
              onRemove();
              setStatsPlayer(null);
            }
          }}
        />
      </div>
    </div>
  );
}
