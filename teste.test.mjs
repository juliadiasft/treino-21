// node controle-21/teste.test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const T = require("./teste.js"), P = require("./programa.js");
let ok = 0, falhou = 0;
const v = (cond, msg) => { if (cond) ok++; else { falhou++; console.log("FALHOU:", msg); } };

// Menor de idade bloqueia.
v(T.resultado([0, 0, 0, 0, 0, 0, 3, 0]).bloqueado, "menor bloqueia");
// Perfis puros.
const ans = T.resultado([1, 2, 2, 0, 2, 2, 3, 0]);
v(ans.perfil === "a" && !ans.bloqueado, "perfil ansiedade: " + JSON.stringify(ans));
const sen = T.resultado([1, 0, 0, 2, 0, 2, 3, 1]);
v(sen.perfil === "s", "perfil sensibilidade: " + JSON.stringify(sen));
const hab = T.resultado([2, 3, 1, 2, 1, 0, 3, 3]);
v(hab.perfil === "h", "perfil hábito: " + JSON.stringify(hab));
// Partes somam 100.
for (const r of [ans, sen, hab]) v(r.parte.a + r.parte.s + r.parte.h === 100, "partes somam 100");
// Alertas.
v(T.resultado([1, 1, 1, 1, 1, 1, 0, 0]).alertas.includes("erecao"), "alerta ereção");
v(T.resultado([1, 1, 1, 1, 1, 1, 2, 0]).alertas.includes("sangue"), "alerta sangue");
v(T.resultado([1, 0, 0, 1, 0, 1, 3, 0]).alertas.includes("sempre"), "sempre + <1 min pede médico");
v(!T.resultado([1, 1, 0, 1, 0, 1, 3, 0]).alertas.includes("sempre"), "sempre mas >1 min não pede");
// Toda pergunta tem pelo menos 2 opções; toda combinação dá um perfil válido.
v(T.PERGUNTAS.every(q => q.opcoes.length >= 2), "opções");
const idx = T.PERGUNTAS.map(() => 0);
let combos = 0;
(function rec(i) {
  if (i === T.PERGUNTAS.length) { const r = T.resultado(idx); combos++; if (!["a", "s", "h"].includes(r.perfil)) v(false, "perfil inválido " + idx); return; }
  for (let k = 0; k < T.PERGUNTAS[i].opcoes.length; k++) { idx[i] = k; rec(i + 1); }
})(0);
v(combos > 1000, "combinações testadas: " + combos);

// Programa.
v(P.total === 21, "21 dias");
for (let d = 1; d <= 21; d++) {
  const t = P.diaDoTreino(d, "s");
  v(t && t.titulo && t.tarefa.length && t.cabeca && t.extra && t.minutos >= 7 && t.minutos <= 15, "dia " + d + " completo (" + (t && t.minutos) + " min)");
  v(t.fase.n === (d <= 7 ? 1 : d <= 14 ? 2 : 3), "fase do dia " + d);
}
v(P.serie(1).c < P.serie(21).c, "série progride");
v(P.diaDoTreino(22) === null, "não existe dia 22");
v(P.diaDoTreino(5, "").extra === "", "sem perfil, sem extra");
const ini = new Date(2026, 9, 13, 22, 0);
v(P.diaLiberado(ini, new Date(2026, 9, 13, 23)) === 1, "mesmo dia = 1");
v(P.diaLiberado(ini, new Date(2026, 9, 14, 0, 5)) === 2, "virou o dia = 2");
v(P.diaLiberado(ini, new Date(2026, 11, 30)) === 21, "trava em 21");
// Nada de promessa proibida no texto.
const texto = JSON.stringify([P.DIAS, P.EXTRA, T.PERGUNTAS, T.PERFIS]).toLowerCase();
for (const p of ["cura", "garantido", "100%", "médico theo", "dr. theo"]) v(!texto.includes(p), "texto sem '" + p + "'");

console.log(`${ok} ok, ${falhou} falhou`);
process.exit(falhou ? 1 : 0);
