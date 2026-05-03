import './PlayerStatsModal.css';

export default function PlayerStatsModal({ 
  player, 
  onClose, 
  isSelecting = false,
  isSelected = false,
  onAddPlayer,
  onRemovePlayer
}) {
  if (!player) return null;

  const initials = player.nome
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="player-stats-overlay" onClick={onClose}>
      <div className="player-stats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stats-close" onClick={onClose}>✕</button>
        
        <div className="stats-header">
          <div className="stats-avatar">
            {player.foto_url ? (
              <img src={player.foto_url} alt={player.nome} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="stats-info">
            <div className="stats-nome">{player.nome}</div>
            <div className="stats-time">{player.time}</div>
            <div className="stats-posicao">{player.posicao.toUpperCase()}</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card pontos">
            <div className="stats-label">Pontos</div>
            <div className="stats-value">{player.pontos || 0}</div>
          </div>
          <div className="stats-card preco">
            <div className="stats-label">Preço</div>
            <div className="stats-value">C${player.preco || 0}</div>
          </div>
        </div>

        <div className="stats-eventos">
          <div className="stats-evento gol">
            <div className="stats-evento-icon">⚽</div>
            <div className="stats-evento-info">
              <div className="stats-evento-label">Gols</div>
              <div className="stats-evento-count">{player.gols || 0}</div>
            </div>
          </div>
          <div className="stats-evento assistencia">
            <div className="stats-evento-icon">🅐</div>
            <div className="stats-evento-info">
              <div className="stats-evento-label">Assistências</div>
              <div className="stats-evento-count">{player.assistencias || 0}</div>
            </div>
          </div>
          <div className="stats-evento amarelo">
            <div className="stats-evento-icon">🟨</div>
            <div className="stats-evento-info">
              <div className="stats-evento-label">Cartões Amarelos</div>
              <div className="stats-evento-count">{player.amarelos || 0}</div>
            </div>
          </div>
          <div className="stats-evento vermelho">
            <div className="stats-evento-icon">🟥</div>
            <div className="stats-evento-info">
              <div className="stats-evento-label">Cartões Vermelhos</div>
              <div className="stats-evento-count">{player.vermelhos || 0}</div>
            </div>
          </div>
        </div>

        {isSelecting ? (
          <div className="stats-actions">
            {isSelected ? (
              <button className="stats-btn stats-btn-remover" onClick={onRemovePlayer}>
                ✕ Remover do Time
              </button>
            ) : (
              <button className="stats-btn stats-btn-adicionar" onClick={onAddPlayer}>
                + Adicionar ao Time
              </button>
            )}
            <button className="stats-btn stats-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        ) : (
          <button className="stats-btn-fechar" onClick={onClose}>
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
