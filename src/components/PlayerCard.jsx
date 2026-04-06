import './PlayerCard.css';

export default function PlayerCard({ player, onSelect, disabled, selected }) {
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
      onClick={() => !disabled && onSelect?.(player)}
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
    </div>
  );
}
