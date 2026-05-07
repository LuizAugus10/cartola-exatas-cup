import './GoalkeeperSelectModal.css';

export default function GoalkeeperSelectModal({
  isOpen,
  onClose,
  goalkeepers,
  onSelect
}) {
  if (!isOpen || !goalkeepers || goalkeepers.length === 0) return null;

  const initials = (nome) => 
    nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handleSelect = (gk) => {
    onSelect(gk.id);
    onClose();
  };

  return (
    <div className="gk-overlay" onClick={onClose}>
      <div className="gk-modal" onClick={(e) => e.stopPropagation()}>
        <button className="gk-close" onClick={onClose}>✕</button>
        
        <div className="gk-header">
          <h2>Qual goleiro tomou o gol?</h2>
          <p>Selecione o goleiro que sofreu o gol</p>
        </div>

        <div className="gk-list">
          {goalkeepers.map((gk) => (
            <div key={gk.id} className="gk-card">
              <div className="gk-avatar">
                {gk.foto_url ? (
                  <img src={gk.foto_url} alt={gk.nome} />
                ) : (
                  <span>{initials(gk.nome)}</span>
                )}
              </div>
              
              <div className="gk-info">
                <div className="gk-nome">{gk.nome}</div>
                <div className="gk-time">{gk.time}</div>
                <div className="gk-badge">🧤 GOL</div>
              </div>

              <button
                className="gk-select-btn"
                onClick={() => handleSelect(gk)}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
