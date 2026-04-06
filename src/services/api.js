const BASE_URL =
  'https://script.google.com/macros/s/AKfycbw3PFsJjXjliBAj9BZAioM4u5F6_YbGt7csOVAhNobadRMxC3QiOz8LkBLfFHqP1t9Qag/exec';

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
