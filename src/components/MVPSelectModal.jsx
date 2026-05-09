import './MVPSelectModal.css';

export default function MVPSelectModal({
  isOpen,
  onClose,
  jogadores,
  onSelect
}) {
  if (!isOpen || !jogadores || jogadores.length === 0) return null;

  const initials = (nome) => 
    nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handleSelect = (jogador) => {
    onSelect(jogador.id);
    onClose();
  };

  return (
    <div className="mvp-overlay" onClick={onClose}>
      <div className="mvp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mvp-close" onClick={onClose}>✕</button>
        
        <div className="mvp-header">
          <h2>🏆 Quem foi o MVP?</h2>
          <p>Selecione o melhor jogador da partida</p>
        </div>

        <div className="mvp-list">
          {jogadores.map((jogador) => (
            <div key={jogador.id} className="mvp-card">
              <div className="mvp-avatar">
                {jogador.foto_url ? (
                  <img src={jogador.foto_url} alt={jogador.nome} />
                ) : (
                  <span>{initials(jogador.nome)}</span>
                )}
              </div>
              
              <div className="mvp-info">
                <div className="mvp-nome">{jogador.nome}</div>
                <div className="mvp-time">{jogador.time}</div>
                <div className="mvp-posicao">{jogador.posicao}</div>
              </div>

              <button
                className="mvp-select-btn"
                onClick={() => handleSelect(jogador)}
              >
                Escolher
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
