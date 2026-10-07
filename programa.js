// O treino de 21 dias. Só conteúdo, sem tela: dá para testar no Node.
// Linguagem educativa e sem nudez. Nada aqui promete cura.
(function (raiz) {
  "use strict";

  const FASES = [
    { n: 1, nome: "Encontrar o músculo", dias: [1, 7], meta: "Saber onde está o músculo, respirar devagar e dar nota à excitação." },
    { n: 2, nome: "Ganhar controle", dias: [8, 14], meta: "Perceber a subida antes do ponto sem volta e baixar quando quiser." },
    { n: 3, nome: "Levar para a dois", dias: [15, 21], meta: "Usar a respiração, o músculo e as pausas na relação, sem pressão." },
  ];

  // Série do músculo por faixa de dias: segundos contraindo (c), soltando (r), repetições, e rápidas (1s/1s).
  function serie(dia) {
    if (dia <= 3) return { c: 3, r: 3, reps: 10, rapidas: 0, vezes: 2 };
    if (dia <= 7) return { c: 4, r: 4, reps: 10, rapidas: 5, vezes: 2 };
    if (dia <= 10) return { c: 5, r: 5, reps: 10, rapidas: 10, vezes: 2 };
    if (dia <= 14) return { c: 6, r: 6, reps: 12, rapidas: 10, vezes: 2 };
    if (dia <= 18) return { c: 8, r: 8, reps: 10, rapidas: 10, vezes: 2 };
    return { c: 10, r: 10, reps: 10, rapidas: 15, vezes: 2 };
  }

  const RESPIRACAO = "Inspire pelo nariz contando 4, enchendo a barriga (não o peito). Solte pela boca contando 6, devagar. Faça 3 minutos.";

  // [título, passos da tarefa do dia, dica para a cabeça]
  const DIAS = [
    ["Achar o músculo", [
      "O músculo do assoalho pélvico é o que você usaria para segurar o xixi ou um pum. Para achar, imagine que vai segurar os dois, sem prender a respiração e sem apertar a barriga, os glúteos ou as coxas.",
      "Faça isso só para identificar. Não fique interrompendo o xixi como exercício: atrapalha a bexiga.",
      "Hoje basta fazer a série do cronômetro deitado, duas vezes no dia.",
    ], "Terminar rápido não é falta de masculinidade. É um reflexo, e reflexo se treina como qualquer outro."],
    ["A escala de 0 a 10", [
      "Controle começa por perceber. Use uma escala: 0 é nenhuma excitação, 10 é o ponto sem volta.",
      "Na próxima vez que estiver sozinho, só observe e dê notas: em que momento você passou do 5? Do 7? Quanto tempo ficou no 8?",
      "Hoje não é para segurar nada. É só para conhecer o caminho.",
    ], "Quem percebe o 6 consegue agir. Quem só percebe o 9 não tem mais tempo. O treino é mover o seu radar para mais cedo."],
    ["Soltar também é treino", [
      "Depois de cada contração, solte de verdade, como quando o xixi começa a sair devagar. Esse é o relaxamento do músculo.",
      "Um músculo que só aperta fica tenso o tempo todo, e tensão acelera. Na série de hoje, preste atenção na parte do “solte”.",
    ], "Respirar curto e prender o ar aumenta a adrenalina. Quando perceber que prendeu, solte o ar devagar."],
    ["Devagar de propósito", [
      "Na prática sozinho de hoje, faça o dobro do tempo de sempre. Mais devagar, sem tela e sem pressa.",
      "Vá dando nota na escala. Quando chegar no 6, respire 4-6 duas vezes antes de continuar.",
    ], "Pressa é aprendida. Muitos homens passaram anos terminando rápido para não serem pegos: o corpo decorou isso."],
    ["Respirar no meio do caminho", [
      "Repita a prática devagar e, quando chegar no 5 ou 6, respire 4-6 três vezes seguidas.",
      "Note o que acontece com a nota: ela costuma parar de subir ou até descer um pouco.",
    ], "Álcool demais e noites mal dormidas pioram o controle. Não é regra, é observação: anote como você estava nos dias bons."],
    ["Corpo solto", [
      "Durante a série e na prática de hoje, procure tensão em quatro lugares: barriga, glúteos, coxas e mandíbula.",
      "Achou tensão? Solte. Controle vem de um corpo solto com um músculo forte, não de um corpo inteiro duro.",
    ], "Pensar “não posso terminar” faz o corpo entrar em alerta. Troque por “vou perceber em que nota estou”."],
    ["Revisão da semana 1", [
      "Responda para você mesmo: em que nota você costuma perceber a subida? Ficou mais fácil achar o músculo?",
      "Se ainda não acha o músculo com certeza, refaça o dia 1 hoje. A fase 2 depende dele.",
    ], "Uma semana feita é a parte mais difícil: criar o hábito. A partir de amanhã, você começa a usar o que treinou."],

    ["Parar e recomeçar", [
      "Esta é a técnica mais usada por terapeutas sexuais. Na prática sozinho, quando chegar no 7, pare totalmente.",
      "Espere a nota cair para 4 ou 5 (costuma levar de 30 segundos a 1 minuto). Respire 4-6 enquanto espera.",
      "Recomece. Faça 3 paradas antes de terminar.",
    ], "Errou e passou do ponto? Faz parte. Cada vez que você chega perto e volta, o corpo aprende onde fica o freio."],
    ["Chegar mais perto", [
      "Repita o parar e recomeçar com 3 paradas, mas agora pare no 8 em vez do 7.",
      "Se passou do ponto, volte para o 7 amanhã. Não tem pressa.",
    ], "Quanto mais vezes você chega no 8 e volta, mais o 8 vira um lugar conhecido, e não um susto."],
    ["Desacelerar em vez de parar", [
      "Agora, no 7, em vez de parar de vez, diminua bem o ritmo e respire 4-6 até a nota cair.",
      "Faça 3 vezes. Na relação, desacelerar é mais natural do que parar.",
    ], "Controle não é durar uma hora. É terminar quando você e a outra pessoa quiserem."],
    ["O músculo como freio", [
      "Quando chegar no 7, faça uma contração longa do músculo (5 a 8 segundos) junto com uma expiração lenta. Depois solte.",
      "Para alguns homens isso baixa a nota; para outros, o que funciona é só soltar o músculo. Teste os dois e anote qual é o seu.",
    ], "Cada corpo responde de um jeito. O treino é descobrir o seu freio, não copiar o de ninguém."],
    ["Mais estímulo, mesmo controle", [
      "Repita o parar e recomeçar com um estímulo um pouco mais forte que o normal (mais ritmo ou um lubrificante à base de água).",
      "Objetivo: manter as 3 paradas mesmo com a nota subindo mais rápido.",
    ], "Se a tela acelera você, faça o treino sem ela. Imagem demais costuma levar a nota do 3 ao 9 em segundos."],
    ["15 minutos sob controle", [
      "Hoje a meta é ficar 15 minutos entre o 4 e o 7, usando as paradas, o ritmo e a respiração.",
      "Sem cronômetro na cara: olhe o relógio só no fim.",
    ], "Se não chegou nos 15 minutos, tudo bem. Anote quanto foi. É contra você mesmo que você compete."],
    ["Revisão da semana 2", [
      "Qual é o seu freio: parar, desacelerar, apertar o músculo ou soltar? Qual nota você consegue segurar?",
      "Se o 7 ainda escapa muito, repita os dias 8 e 9 antes de seguir.",
    ], "Você treinou duas semanas seguidas. Isso é mais do que a maioria dos homens faz a vida inteira sobre o assunto."],

    ["A conversa", [
      "Se tem parceira ou parceiro, uma conversa curta tira metade da pressão. Fora da cama, num momento tranquilo.",
      "Uma frase que funciona: “Estou fazendo um treino para ter mais controle. Às vezes vou pedir para a gente ir mais devagar ou dar uma pausa. Topa me ajudar?”",
      "Sem parceira agora? Siga a fase 3 sozinho e leve o que aprender para quando tiver.",
    ], "A maioria das pessoas reage bem quando ouve isso. O que pesa na relação costuma ser o silêncio, não o tempo."],
    ["Toque sem objetivo", [
      "Combine uma noite de carícias sem penetração e sem a meta de terminar. É uma técnica clássica de terapia sexual chamada foco sensorial.",
      "Vocês se tocam devagar, revezando. Você vai dando nota na escala por dentro e respirando quando passar do 5.",
    ], "Tirar a meta tira a ansiedade. Sem prova para passar, o corpo desacelera sozinho."],
    ["Começar devagar", [
      "Preliminares mais longas e um começo bem devagar. Os primeiros minutos são os mais sensíveis: vá com calma justamente aí.",
      "Respire 4-6 desde o começo, não só quando já estiver no 7.",
    ], "Usar preservativo pode diminuir um pouco a sensibilidade. Para alguns homens, ajuda no controle."],
    ["Posições com mais controle", [
      "Posições em que você está mais relaxado, como deitado de costas ou de lado, costumam dar mais controle do que posições em que você sustenta o peso do corpo.",
      "Tensão nas pernas e na barriga acelera. Escolha onde você consegue ficar solto.",
    ], "Não existe posição mágica. Existe a posição em que o seu corpo fica solto."],
    ["Pausas a dois", [
      "Use o parar e recomeçar na relação. Combinem um sinal simples (uma palavra ou um toque) para pausar.",
      "Na pausa, continuem com beijos e carícias, só sem o estímulo mais forte. Respire até cair para 4 ou 5.",
    ], "Pausa não quebra o clima quando foi combinada antes. Ela vira parte do jogo."],
    ["Juntar tudo", [
      "Hoje use tudo: começo devagar, respiração desde o início, o seu freio no 7, uma ou duas pausas.",
      "Depois, anote o que funcionou melhor. Isso é o seu manual pessoal.",
    ], "Um dia ruim não apaga o treino. Controle é média, não recorde."],
    ["Manter para sempre", [
      "Para não perder o que ganhou: série do músculo 3 vezes por semana e uma prática com parar e recomeçar por semana.",
      "Escorregou depois de um tempo? Volte 3 dias da fase 2. É como academia: quem para, perde, e quem volta, recupera rápido.",
      "Se em 21 dias quase nada mudou, procure um urologista ou um fisioterapeuta pélvico: existem tratamentos que funcionam junto com o treino.",
    ], "Você terminou os 21 dias. Agora o controle é um hábito seu, não um app."],
  ];

  // Um reforço por perfil em cada fase.
  const EXTRA = {
    a: ["Seu perfil é ansiedade: dobre a respiração. Faça 3 minutos de 4-6 antes de dormir, todo dia.",
        "Seu perfil é ansiedade: o seu freio mais forte costuma ser a respiração. Use antes do 7, não depois.",
        "Seu perfil é ansiedade: a conversa do dia 15 é o passo que mais muda o jogo para você."],
    s: ["Seu perfil é sensibilidade: capriche na escala de 0 a 10. Perceber o 6 é o seu treino principal.",
        "Seu perfil é sensibilidade: pare no 6 em vez do 7 nos primeiros dias da fase. Melhor cedo do que tarde.",
        "Seu perfil é sensibilidade: começar devagar (dia 17) e o preservativo podem fazer muita diferença para você."],
    h: ["Seu perfil é hábito: a prática devagar é o seu treino principal. Nunca faça com pressa durante os 21 dias.",
        "Seu perfil é hábito: desacelerar (dia 10) costuma funcionar melhor que parar para você.",
        "Seu perfil é hábito: cuidado para não voltar à pressa sozinho. Mantenha a prática devagar mesmo depois do dia 21."],
  };

  function fase(dia) { return FASES.find(f => dia >= f.dias[0] && dia <= f.dias[1]); }

  function diaDoTreino(dia, perfil) {
    const d = DIAS[dia - 1];
    if (!d) return null;
    const f = fase(dia), s = serie(dia);
    const minutos = 3 + Math.ceil((s.reps * (s.c + s.r) + s.rapidas * 2) / 60) + 4;
    return {
      dia, fase: f, titulo: d[0], tarefa: d[1], cabeca: d[2], serie: s, minutos,
      respiracao: RESPIRACAO,
      extra: perfil && EXTRA[perfil] ? EXTRA[perfil][f.n - 1] : "",
    };
  }

  // Libera um dia por data: o dia N abre N-1 dias depois do começo. Feito ou não, nunca passa de 21.
  function diaLiberado(inicio, hoje) {
    const ms = 864e5, a = new Date(inicio), b = new Date(hoje);
    a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
    return Math.max(1, Math.min(21, Math.floor((b - a) / ms) + 1));
  }

  const api = { FASES, DIAS, EXTRA, serie, fase, diaDoTreino, diaLiberado, total: DIAS.length };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.C21Programa = api;
})(typeof window !== "undefined" ? window : globalThis);
