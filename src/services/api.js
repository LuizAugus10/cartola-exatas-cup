const BASE_URL =
  'https://script.google.com/macros/s/AKfycbydy1gLo2A8u0RGIMX3rwwYIRpy4t5N_2sUxSXKvAFT8nDBfQFeRjQql-oo0Yp1kyESKg/exec';

async function fetchAPI(params) {
  const query = Object.entries(params)
    .map(([key, value]) => {
      const v = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
    })
    .join('&');

  const res = await fetch(`${BASE_URL}?${query}`);
  if (!res.ok) throw new Error('Erro na requisição');
  return res.json();
}

export const login = (telefone) => fetchAPI({ action: 'login', telefone });

export const getPlayers = () => fetchAPI({ action: 'getPlayers' });

export const getMyTeam = (telefone) => fetchAPI({ action: 'getMyTeam', telefone });

export const saveTeam = (data) => fetchAPI({ action: 'saveTeam', ...data });

export const getConfig = () => fetchAPI({ action: 'getConfig' });

export const getRanking = () => fetchAPI({ action: 'getRanking' });

// 🎮 Jogos
export const getJogos = () => fetchAPI({ action: 'getJogos' });

export const criarJogo = (telefone, timeA, timeB) => 
  fetchAPI({ action: 'criarJogo', telefone, timeA, timeB });

export const encerrarJogo = (telefone, jogo_id) => 
  fetchAPI({ action: 'encerrarJogo', telefone, jogo_id });

// 📝 Eventos
export const registrarEvento = (telefone, jogo_id, jogador_id, tipo) => 
  fetchAPI({ action: 'registrarEvento', telefone, jogo_id, jogador_id, tipo });

export const removerEvento = (telefone, evento_id) => 
  fetchAPI({ action: 'removerEvento', telefone, evento_id });

export const getEventosByJogo = (jogo_id) => 
  fetchAPI({ action: 'getEventosByJogo', jogo_id });
