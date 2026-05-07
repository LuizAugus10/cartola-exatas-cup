import { useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import { getJogos } from "../services/api";
import "./TabelaTab.css";

const GRUPOS = {
  A: ["irracionais", "paysandu", "panela", "selecic"],
  B: ["nicotinados", "selest", "claude code", "estatball"],
};

export default function TabelaTab({ onToast }) {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJogos();
  }, []);

  const loadJogos = async () => {
    try {
      const data = await getJogos();
      setJogos(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log("oi");
    await loadJogos();
    console.log(jogos);
    onToast("Tabela atualizada");
  };

  const calculateStats = (grupoTimes) => {
    const jogosFase = jogos.filter(
      (jogo) => jogo.fase === "grupo" && jogo.status === "finalizado",
    );

    const stats = {};
    console.log("gptms");
    console.log(grupoTimes);
    grupoTimes.forEach((time) => {
      stats[time] = {
        time,
        jogos: 0,
        vitórias: 0,
        empates: 0,
        derrotas: 0,
        gf: 0,
        ga: 0,
        pontos: 0,
      };
    });
    console.log("aqui");

    console.log(jogosFase);
    console.log(grupoTimes);

    jogosFase.forEach((jogo) => {
      console.log("tou aqui");
      console.log(" começando");
      console.log(jogo);
      console.log(jogo.timeA);
      console.log(stats);
      console.log(stats[jogo.timeA]);

      if (grupoTimes.includes(jogo.timeA) && grupoTimes.includes(jogo.timeB)) {
        const golsA = Number(jogo.golsA) || 0;
        const golsB = Number(jogo.golsB) || 0;

        // Time A
        stats[jogo.timeA].jogos += 1;
        stats[jogo.timeA].gf += golsA;
        stats[jogo.timeA].ga += golsB;

        if (golsA > golsB) {
          stats[jogo.timeA].vitórias += 1;
          stats[jogo.timeA].pontos += 3;
        } else if (golsA < golsB) {
          stats[jogo.timeA].derrotas += 1;
        } else {
          stats[jogo.timeA].empates += 1;
          stats[jogo.timeA].pontos += 1;
        }

        // Time B
        stats[jogo.timeB].jogos += 1;
        stats[jogo.timeB].gf += golsB;
        stats[jogo.timeB].ga += golsA;

        if (golsB > golsA) {
          stats[jogo.timeB].vitórias += 1;
          stats[jogo.timeB].pontos += 3;
        } else if (golsB < golsA) {
          stats[jogo.timeB].derrotas += 1;
        } else {
          stats[jogo.timeB].empates += 1;
          stats[jogo.timeB].pontos += 1;
        }
      }
    });

    return Object.values(stats).sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      const saldoA = a.gf - a.ga;
      const saldoB = b.gf - b.ga;
      if (saldoB !== saldoA) return saldoB - saldoA;
      return b.gf - a.gf;
    });
  };

  const grupoAStats = useMemo(() => calculateStats(GRUPOS.A), [jogos]);
  const grupoBStats = useMemo(() => calculateStats(GRUPOS.B), [jogos]);

  if (loading) return <Loading text="Carregando tabela..." />;

  const renderTabel = (stats, grupoNome) => (
    <div className="tabela-grupo">
      <h3 className="tabela-titulo">Grupo {grupoNome}</h3>
      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th className="col-pos">Pos</th>
              <th className="col-time">Time</th>
              <th className="col-num">Saldo</th>
              <th className="col-pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item, idx) => {
              const saldo = item.gf - item.ga;
              const isClassificado = idx < 2;
              return (
                <tr
                  key={item.time}
                  className={`tabela-row ${isClassificado ? "classificado" : ""}`}
                >
                  <td className="col-pos">{idx + 1}</td>
                  <td className="col-time">{item.time.toUpperCase()}</td>
                  <td className="col-num">
                    {saldo > 0 ? "+" : ""}
                    {saldo}
                  </td>
                  <td className="col-pts">{item.pontos}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="tabela-nota">Top 2 classificam para a semifinal</p>
    </div>
  );

  return (
    <div className="tabela-tab">
      <div className="tabela-header">
        <h2>📊 Tabela</h2>
        <button className="tabela-refresh" onClick={handleRefresh}>
          ↻
        </button>
      </div>

      <div className="tabelas-container">
        {renderTabel(grupoAStats, "A")}
        {renderTabel(grupoBStats, "B")}
      </div>
    </div>
  );
}
