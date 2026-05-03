import './PlayerCard.css';

export default function PlayerCard({ player, onSelect, disabled, selected, onViewStats, showStats = true }) {
  const initials = player.nome
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isGoleiro = player.posicao === 'goleiro';

  return (
    <div
      className={`fut-card ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''} ${isGoleiro ? 'goleiro' : 'linha'}`}
      onClick={() => !disabled && (showStats === false ? onViewStats?.(player) : onSelect?.(player))}
    >
      <div className="fut-card-top">
        <div className="fut-card-stats">
          <span className="fut-card-points">{player.pontos}</span>
          <span className="fut-card-position">{isGoleiro ? 'GOL' : 'LIN'}</span>
          <span className="fut-card-price">C${player.preco}</span>
        </div>
        <div className="fut-card-avatar">
          {player.foto_url ? (
            <img src={player.foto_url} alt={player.nome} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>
      <div className="fut-card-name">{player.nome}</div>
      <div className="fut-card-team">{player.time}</div>
      {showStats && (
        <div className="fut-card-stats-footer">
          <button 
            className="stats-icon stats-gols" 
            title={`${player.gols || 0} Gols`}
            onClick={(e) => {
              e.stopPropagation();
              onViewStats?.(player);
            }}
          >
            ⚽ {player.gols || 0}
          </button>
          <button 
            className="stats-icon stats-assist" 
            title={`${player.assistencias || 0} Assistências`}
            onClick={(e) => {
              e.stopPropagation();
              onViewStats?.(player);
            }}
          >
            🅐 {player.assistencias || 0}
          </button>
          <button 
            className="stats-icon stats-amarelo" 
            title={`${player.amarelos || 0} Amarelos`}
            onClick={(e) => {
              e.stopPropagation();
              onViewStats?.(player);
            }}
          >
            🟨 {player.amarelos || 0}
          </button>
          <button 
            className="stats-icon stats-vermelho" 
            title={`${player.vermelhos || 0} Vermelhos`}
            onClick={(e) => {
              e.stopPropagation();
              onViewStats?.(player);
            }}
          >
            🟥 {player.vermelhos || 0}
          </button>
        </div>
      )}
    </div>
  );
}
