// Regras do teste anônimo. Sem tela aqui: dá para testar no Node (node teste.test.mjs).
(function (raiz) {
  "use strict";

  // Cada opção soma pontos em ansiedade (a), sensibilidade (s) e hábito (h).
  // "bloqueia": menor de idade. "alerta": sinais para procurar o urologista antes.
  const PERGUNTAS = [
    { id: "idade", texto: "Qual a sua idade?", ajuda: "O Controle 21 é só para maiores de 18 anos.", opcoes: [
      { t: "Menos de 18", bloqueia: true },
      { t: "18 a 29" }, { t: "30 a 44" }, { t: "45 ou mais" },
    ] },
    { id: "tempo", texto: "Depois da penetração, quanto tempo você costuma durar?", ajuda: "Chute uma média, ninguém mede no relógio.", opcoes: [
      { t: "Menos de 1 minuto", s: 3, nivel: 3 },
      { t: "De 1 a 3 minutos", s: 1, a: 1, nivel: 2 },
      { t: "De 3 a 5 minutos", a: 1, nivel: 1 },
      { t: "Mais de 5, mas queria mais controle", h: 1, nivel: 1 },
    ] },
    { id: "desde", texto: "Desde quando é assim?", opcoes: [
      { t: "Sempre foi, desde as primeiras vezes", s: 2, sempre: true },
      { t: "Começou depois de um tempo", a: 2 },
      { t: "Depende da pessoa ou da situação", a: 3 },
    ] },
    { id: "cabeca", texto: "Antes ou durante, você fica preocupado em terminar rápido?", opcoes: [
      { t: "Quase sempre, e isso me trava", a: 3 },
      { t: "Às vezes", a: 1 },
      { t: "Não penso nisso", s: 1 },
    ] },
    { id: "aviso", texto: "Você percebe quando está chegando no ponto sem volta?", opcoes: [
      { t: "Não, chega sem aviso", s: 3 },
      { t: "Percebo, mas não consigo segurar", s: 1, h: 1 },
      { t: "Percebo e às vezes consigo segurar", h: 1, a: 1 },
    ] },
    { id: "pressa", texto: "Quando está sozinho, você costuma terminar com pressa?", ajuda: "Pressa vira hábito: o corpo aprende a terminar rápido.", opcoes: [
      { t: "Sim, quase sempre rápido", h: 3 },
      { t: "Às vezes", h: 1 },
      { t: "Não", s: 1 },
    ] },
    { id: "sinais", texto: "Você tem algum destes sinais?", opcoes: [
      { t: "Dificuldade para ter ou manter a ereção", alerta: "erecao" },
      { t: "Dor ou ardência", alerta: "dor" },
      { t: "Sangue no sêmen ou na urina", alerta: "sangue" },
      { t: "Nenhum desses" },
    ] },
    { id: "tentou", texto: "Já tentou alguma coisa?", opcoes: [
      { t: "Nada ainda" },
      { t: "Spray ou pomada", s: 1 },
      { t: "Remédio com receita", s: 1 },
      { t: "Exercícios por conta própria", h: 1 },
    ] },
  ];

  const PERFIS = {
    a: { nome: "Ansiedade", frase: "A sua cabeça acelera antes do corpo.",
      explica: "Preocupação em terminar rápido solta adrenalina, e ela encurta o caminho. O seu treino dá peso à respiração lenta e a tirar o foco do “vou terminar”.",
      foco: "respiração" },
    s: { nome: "Sensibilidade", frase: "O seu corpo chega no ponto sem dar aviso.",
      explica: "Quando o aviso some, é preciso aprender a perceber a subida bem antes. O seu treino dá peso à escala de 0 a 10 e à técnica de parar e recomeçar.",
      foco: "percepção" },
    h: { nome: "Hábito", frase: "O seu corpo aprendeu a terminar com pressa.",
      explica: "Anos terminando rápido ensinam o corpo a fazer assim. Dá para reensinar: o seu treino dá peso a ir devagar e ao músculo do assoalho pélvico.",
      foco: "ritmo" },
  };

  function resultado(respostas) {
    const pts = { a: 0, s: 0, h: 0 };
    const alertas = [];
    let bloqueado = false, nivel = 1, sempre = false;
    PERGUNTAS.forEach((q, i) => {
      const o = q.opcoes[respostas[i]];
      if (!o) return;
      if (o.bloqueia) bloqueado = true;
      if (o.alerta) alertas.push(o.alerta);
      if (o.nivel) nivel = o.nivel;
      if (o.sempre) sempre = true;
      ["a", "s", "h"].forEach(k => { pts[k] += o[k] || 0; });
    });
    const total = pts.a + pts.s + pts.h || 1;
    // Empate: ansiedade > sensibilidade > hábito (a ordem do treino).
    const perfil = ["a", "s", "h"].reduce((m, k) => (pts[k] > pts[m] ? k : m), "a");
    const parte = { a: Math.round(pts.a / total * 100), s: Math.round(pts.s / total * 100), h: 0 };
    parte.h = 100 - parte.a - parte.s;
    // Sempre foi assim + menos de 1 minuto: treino serve, mas o médico vem junto.
    if (sempre && nivel === 3) alertas.push("sempre");
    return { bloqueado, perfil, pts, parte, nivel, alertas };
  }

  const api = { PERGUNTAS, PERFIS, resultado };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.C21Teste = api;
})(typeof window !== "undefined" ? window : globalThis);
