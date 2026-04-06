import './CourtView.css';

const TITULAR_SLOTS = [
  { id: 0, type: 'goleiro', label: 'GOL', className: 'slot-gk' },
  { id: 1, type: 'linha', label: 'FIX', className: 'slot-def1' },
  { id: 2, type: 'linha', label: 'FIX', className: 'slot-def2' },
  { id: 3, type: 'linha', label: 'ALA', className: 'slot-atk1' },
  { id: 4, type: 'linha', label: 'PIV', className: 'slot-atk2' },
];

export default function CourtView({ titulares, onSlotClick, onRemovePlayer, disabled }) {
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
              onClick={() => !disabled && onSlotClick(slot.id)}
            >
              {player ? (
                <div className="slot-player">
                  <div className="slot-avatar">
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
