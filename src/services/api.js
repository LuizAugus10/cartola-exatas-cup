const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxwRzoKcWYBWasQ0a37nKQTowyd34Ar-ZoOHT7bvz3ZHqey57dBvCPril6bFGNog-MRQg/exec";

async function fetchAPI(params) {
  const query = Object.entries(params)
    .map(([key, value]) => {
      const v =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
    })
    .join("&");

  const res = await fetch(`${BASE_URL}?${query}`);
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

export const login = (telefone) => fetchAPI({ action: "login", telefone });

export const getPlayers = () => fetchAPI({ action: "getPlayers" });

export const getMyTeam = (telefone) =>
  fetchAPI({ action: "getMyTeam", telefone });

export const saveTeam = (data) => fetchAPI({ action: "saveTeam", ...data });

export const getConfig = () => fetchAPI({ action: "getConfig" });

export const getRanking = () => fetchAPI({ action: "getRanking" });

// 🎮 Jogos
export const getJogos = () => fetchAPI({ action: "getJogos" });

export const criarJogo = (telefone, timeA, timeB, fase = "grupo") =>
  fetchAPI({ action: "criarJogo", telefone, timeA, timeB, fase });

export const encerrarJogo = (telefone, jogo_id) =>
  fetchAPI({ action: "encerrarJogo", telefone, jogo_id });

// 📝 Eventos
export const registrarEvento = (
  telefone,
  jogo_id,
  jogador_id,
  tipo,
  goleiro_id,
) =>
  fetchAPI({
    action: "registrarEvento",
    telefone,
    jogo_id,
    jogador_id,
    tipo,
    ...(goleiro_id && { goleiro_id }),
  });

export const removerEvento = (telefone, evento_id) =>
  fetchAPI({ action: "removerEvento", telefone, evento_id });

export const getEventosByJogo = (jogo_id) =>
  fetchAPI({ action: "getEventosByJogo", jogo_id });
