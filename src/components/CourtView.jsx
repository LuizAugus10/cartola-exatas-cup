import './CourtView.css';

const TITULAR_SLOTS = [
  { id: 0, type: 'goleiro', label: 'GOL', className: 'slot-gk', pos: 'diamond-top' },
  { id: 1, type: 'linha', label: 'LI', className: 'slot-left-mid', pos: 'diamond-left' },
  { id: 2, type: 'linha', label: 'LI', className: 'slot-right-mid', pos: 'diamond-right' },
  { id: 3, type: 'linha', label: 'LI', className: 'slot-left-low', pos: 'diamond-low-left' },
  { id: 4, type: 'linha', label: 'LI', className: 'slot-right-low', pos: 'diamond-low-right' },
];

export default function CourtView({ titulares, onSlotClick, onPlayerClick, onRemovePlayer, disabled }) {
  return (
    <div className="court-container">
      <div className="court">
        <div className="court-center-line" />
        <div className="court-center-circle" />
        <div className="court-penalty-top" />
        <div className="court-penalty-bottom" />
        <div className="court-goal-top" />
        <div className="court-goal-bottom" />

        {TITULAR_SLOTS.map((slot) => {
          const player = titulares[slot.id];
          return (
            <div
              key={slot.id}
              className={`court-slot ${slot.className} ${player ? 'filled' : 'empty'}`}
              onClick={() => !disabled && !player && onSlotClick(slot.id)}
            >
              {player ? (
                <div 
                  className="slot-player"
                  onClick={() => !disabled && onPlayerClick?.(player)}
                >
                  <div 
                    className="slot-avatar"
                  >
                    {player.foto_url ? (
                      <img src={player.foto_url} alt="" />
                    ) : (
                      player.nome
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    )}
                  </div>
                  <div className="slot-name">{player.nome.split(' ')[0]}</div>
                  {!disabled && (
                    <button
                      className="slot-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePlayer('titular', slot.id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className="slot-empty-content">
                  <span className="slot-plus">+</span>
                  <span className="slot-label">{slot.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
