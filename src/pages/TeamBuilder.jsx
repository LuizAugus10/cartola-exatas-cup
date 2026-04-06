import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPlayers, getMyTeam, getConfig, saveTeam } from '../services/api';
import CourtView from '../components/CourtView';
import PlayerSelectModal from '../components/PlayerSelectModal';
import Loading from '../components/Loading';
import './TeamBuilder.css';

export default function TeamBuilder({ user, onToast }) {
  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState(null);
  const [titulares, setTitulares] = useState([null, null, null, null, null]);
  const [reservas, setReservas] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.telefone]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, configData, teamData] = await Promise.all([
        getPlayers(),
        getConfig(),
        getMyTeam(user.telefone),
      ]);

      setPlayers(playersData);
      setConfig(configData);

      if (teamData.success && teamData.titulares?.length && teamData.reservas?.length) {
        const playerMap = {};
        playersData.forEach((p) => (playerMap[p.id] = p));

        const loadedTit = [null, null, null, null, null];
        const loadedRes = [null, null, null, null, null];

        teamData.titulares.forEach((id) => {
          const p = playerMap[id];
          if (!p) return;
          if (p.posicao === 'goleiro') {
            loadedTit[0] = p;
          } else {
            const idx = loadedTit.findIndex((s, i) => i > 0 && s === null);
            if (idx !== -1) loadedTit[idx] = p;
          }
        });

        teamData.reservas.forEach((id) => {
          const p = playerMap[id];
          if (!p) return;
          if (p.posicao === 'goleiro') {
            loadedRes[0] = p;
          } else {
            const idx = loadedRes.findIndex((s, i) => i > 0 && s === null);
            if (idx !== -1) loadedRes[idx] = p;
          }
        });

        setTitulares(loadedTit);
        setReservas(loadedRes);
      }
    } catch (err) {
      onToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isMarketOpen = config && String(config.edicao_aberta).toLowerCase() === 'true';

  const selectedIds = useMemo(() => {
    const ids = new Set();
    [...titulares, ...reservas].forEach((p) => {
      if (p) ids.add(p.id);
    });
    return ids;
  }, [titulares, reservas]);

  const totalCost = useMemo(() => {
    return [...titulares, ...reservas].reduce((sum, p) => sum + (p ? Number(p.preco) : 0), 0);
  }, [titulares, reservas]);

  const maxBudget = config ? Number(config.orcamento_max) || 100 : 100;
  const budgetPercent = Math.min((totalCost / maxBudget) * 100, 100);
  const budgetOk = totalCost <= maxBudget;
  const filledCount = [...titulares, ...reservas].filter(Boolean).length;

  const handleSlotClick = useCallback(
    (group, index) => {
      if (!isMarketOpen) return;
      setModalSlot({ group, index });
      setModalOpen(true);
    },
    [isMarketOpen]
  );

  const handlePlayerSelect = useCallback(
    (player) => {
      if (!modalSlot) return;
      const { group, index } = modalSlot;

      if (group === 'titular') {
        setTitulares((prev) => {
          const next = [...prev];
          next[index] = player;
          return next;
        });
      } else {
        setReservas((prev) => {
          const next = [...prev];
          next[index] = player;
          return next;
        });
      }
      setModalOpen(false);
      setModalSlot(null);
    },
    [modalSlot]
  );

  const handleRemovePlayer = useCallback((group, index) => {
    if (group === 'titular') {
      setTitulares((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    } else {
      setReservas((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
    setModalOpen(false);
    setModalSlot(null);
  }, []);

  const handleSave = async () => {
    if (filledCount !== 10) {
      onToast('Preencha todos os 10 jogadores', 'error');
      return;
    }
    if (!budgetOk) {
      onToast('Orçamento excedido!', 'error');
      return;
    }

    setSaving(true);
    try {
      const result = await saveTeam({
        telefone: user.telefone,
        nome: user.nome,
        titulares: titulares.map((p) => p.id),
        reservas: reservas.map((p) => p.id),
      });

      if (result.success) {
        onToast('Time salvo com sucesso!', 'success');
      } else {
        onToast(result.message || 'Erro ao salvar', 'error');
      }
    } catch (err) {
      onToast('Erro de conexão', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Carregando jogadores..." />;

  const currentSlotPlayer = modalSlot
    ? (modalSlot.group === 'titular' ? titulares : reservas)[modalSlot.index]
    : null;

  const positionFilter = modalSlot?.index === 0 ? 'goleiro' : 'linha';

  return (
    <div className="team-builder">
      {/* Budget Bar */}
      <div className="budget-bar">
        <div className="budget-info">
          <span className="budget-label">Orçamento</span>
          <span className={`budget-value ${budgetOk ? '' : 'over'}`}>
            C${totalCost} / {maxBudget}
          </span>
        </div>
        <div className="budget-track">
          <div
            className={`budget-fill ${budgetOk ? '' : 'over'}`}
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
        <div className="budget-count">{filledCount}/10 jogadores</div>
      </div>

      {!isMarketOpen && (
        <div className="market-closed">
          🔒 Mercado fechado — não é possível alterar o time
        </div>
      )}

      {/* Court */}
      <CourtView
        titulares={titulares}
        onSlotClick={(index) => handleSlotClick('titular', index)}
        onRemovePlayer={handleRemovePlayer}
        disabled={!isMarketOpen}
      />

      {/* Reservas */}
      <div className="reservas-section">
        <h3 className="reservas-title">
          Reservas <span>(0.5x pontos)</span>
        </h3>
        <div className="reservas-row">
          {reservas.map((player, index) => (
            <div
              key={index}
              className={`reserva-slot ${player ? 'filled' : 'empty'}`}
              onClick={() => isMarketOpen && handleSlotClick('reserva', index)}
            >
              {player ? (
                <div className="reserva-player">
                  <div className="reserva-avatar">
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
                  <div className="reserva-info">
                    <span className="reserva-name">{player.nome.split(' ')[0]}</span>
                    <span className="reserva-detail">
                      {player.posicao === 'goleiro' ? 'GOL' : 'LIN'} · C${player.preco}
                    </span>
                  </div>
                  {isMarketOpen && (
                    <button
                      className="reserva-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlayer('reserva', index);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className="reserva-empty">
                  <span>+</span>
                  <span>{index === 0 ? 'GOL' : 'LIN'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {isMarketOpen && (
        <div className="save-section">
          <button
            className={`save-btn ${filledCount === 10 && budgetOk ? '' : 'disabled'}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Time'}
          </button>
        </div>
      )}

      {/* Player Selection Modal */}
      {modalOpen && (
        <PlayerSelectModal
          players={players}
          selectedIds={selectedIds}
          positionFilter={positionFilter}
          onSelect={handlePlayerSelect}
          onRemove={
            currentSlotPlayer
              ? () => handleRemovePlayer(modalSlot.group, modalSlot.index)
              : null
          }
          onClose={() => {
            setModalOpen(false);
            setModalSlot(null);
          }}
          currentPlayer={currentSlotPlayer}
        />
      )}
    </div>
  );
}
