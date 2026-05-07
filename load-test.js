/**
 * Load test para o backend Google Apps Script
 * Ferramenta: k6 (https://k6.io)
 *
 * Instalação:
 *   Linux: sudo snap install k6
 *      ou: sudo apt install k6
 *      ou: https://dl.k6.io/deb/repo.list (ver docs)
 *
 * Execução:
 *   k6 run load-test.js
 *
 *   Com mais usuários:
 *   k6 run --vus 50 --duration 30s load-test.js
 *
 *   Salvando resultado em JSON:
 *   k6 run --out json=resultado.json load-test.js
 */

import { check, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxwRzoKcWYBWasQ0a37nKQTowyd34Ar-ZoOHT7bvz3ZHqey57dBvCPril6bFGNog-MRQg/exec";

// Métricas customizadas
const rankingDuration = new Trend("ranking_duration");
const loginDuration = new Trend("login_duration");
const errorRate = new Rate("errors");

// -------------------------------------------------------------------
// Configuração dos estágios de carga
// Ajuste os valores conforme quiser testar:
//   vus       = usuários virtuais simultâneos
//   duration  = quanto tempo fica nesse estágio
// -------------------------------------------------------------------
export const options = {
  stages: [
    { duration: "15s", target: 10 }, // sobe para 10 usuários em 15s
    { duration: "30s", target: 50 }, // sobe para 50 usuários em 30s
    { duration: "30s", target: 100 }, // pico: 100 usuários por 30s
    { duration: "15s", target: 0 }, // desaquece
  ],
  thresholds: {
    // 95% das requisições de ranking devem terminar em menos de 8s
    ranking_duration: ["p(95)<8000"],
    // Menos de 10% de erros
    errors: ["rate<0.10"],
    // Tempo geral de resposta HTTP
    http_req_duration: ["p(95)<10000"],
  },
};

// Pool de telefones fictícios para simular usuários diferentes
const TELEFONES = Array.from(
  { length: 100 },
  (_, i) => `1199900${String(i).padStart(4, "0")}`,
);

function randomTelefone() {
  return TELEFONES[Math.floor(Math.random() * TELEFONES.length)];
}

// -------------------------------------------------------------------
// Cenário principal — cada VU (usuário virtual) executa em loop
// -------------------------------------------------------------------
export default function () {
  const telefone = randomTelefone();

  // 1. Login (toda vez que o usuário abre o app)
  const loginRes = http.get(`${BASE_URL}?action=login&telefone=${telefone}`);
  loginDuration.add(loginRes.timings.duration);
  const loginOk = check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "login body ok": (r) => r.body && r.body.length > 0,
  });
  errorRate.add(!loginOk);

  sleep(1);

  // 2. Buscar ranking (ação mais frequente no dia do campeonato)
  const rankingRes = http.get(`${BASE_URL}?action=getRanking`);
  rankingDuration.add(rankingRes.timings.duration);
  const rankingOk = check(rankingRes, {
    "ranking status 200": (r) => r.status === 200,
    "ranking tem dados": (r) => {
      try {
        return Array.isArray(JSON.parse(r.body));
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!rankingOk);

  sleep(1);

  // 3. Buscar jogadores (~50% das sessões — nem todos editam o time)
  if (Math.random() < 0.5) {
    const playersRes = http.get(`${BASE_URL}?action=getPlayers`);
    const playersOk = check(playersRes, {
      "getPlayers status 200": (r) => r.status === 200,
    });
    errorRate.add(!playersOk);
    sleep(0.5);
  }

  // 4. Buscar time do usuário (~50% das sessões)
  if (Math.random() < 0.5) {
    const teamRes = http.get(
      `${BASE_URL}?action=getMyTeam&telefone=${telefone}`,
    );
    const teamOk = check(teamRes, {
      "getMyTeam status 200": (r) => r.status === 200,
    });
    errorRate.add(!teamOk);
    sleep(0.5);
  }

  // Pequena pausa entre iterações (simula o usuário lendo a tela)
  sleep(Math.random() * 2 + 1);
}
