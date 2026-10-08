// Tela do teste e do resultado. As regras ficam em teste.js.
(function () {
  "use strict";
  const C = window.C21 || {};
  const T = window.C21Teste;
  const $ = s => document.querySelector(s);
  const quiz = $("#quiz"), corpo = $("#quiz-corpo"), pagina = $("#pagina");
  let respostas = [], passo = 0;

  const whats = (txt) => C.whatsapp ? "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(txt) : "";
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento: segue */ } }

  document.querySelectorAll("[data-preco]").forEach(e => { e.textContent = C.preco || "37,90"; });
  document.querySelectorAll("[data-so-whats]").forEach(e => { e.hidden = !C.whatsapp; });
  document.querySelectorAll("[data-whats-link]").forEach(e => { e.href = whats("Oi! Tenho uma dúvida sobre o Controle 21.") || "#"; });

  const M = window.C21Metricas || { evento() {}, umaVezPorSessao() {}, umaVezPorAparelho() {} };
  M.umaVezPorSessao("visita");

  function abrir() {
    M.umaVezPorSessao("teste_inicio");
    respostas = []; passo = 0;
    quiz.hidden = false; pagina.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "hidden";
    pergunta();
  }
  function fechar() {
    quiz.hidden = true; pagina.removeAttribute("aria-hidden");
    document.body.style.overflow = "";
  }

  function pergunta() {
    const q = T.PERGUNTAS[passo], n = T.PERGUNTAS.length;
    corpo.innerHTML = `
      <div class="q-topo"><button type="button" data-voltar>${passo ? "← Voltar" : "✕ Fechar"}</button><span>${passo + 1} de ${n} · anônimo</span></div>
      <div class="barra"><i style="width:${(passo / n) * 100}%"></i></div>
      <h2 id="q-titulo" tabindex="-1">${q.texto}</h2>
      ${q.ajuda ? `<p class="q-ajuda">${q.ajuda}</p>` : ""}
      <div class="opcoes" role="group" aria-labelledby="q-titulo">
        ${q.opcoes.map((o, i) => `<button type="button" data-op="${i}">${o.t}</button>`).join("")}
      </div>`;
    corpo.querySelector("#q-titulo").focus();
  }

  function escolher(i) {
    respostas[passo] = i;
    const o = T.PERGUNTAS[passo].opcoes[i];
    if (o.bloqueia) return menor();
    passo++;
    if (passo < T.PERGUNTAS.length) pergunta(); else final();
  }

  function menor() {
    corpo.innerHTML = `
      <h2 tabindex="-1" id="q-titulo">O Controle 21 é só para maiores de 18 anos.</h2>
      <p class="q-ajuda">Se algo te preocupa no seu corpo, converse com um adulto de confiança ou procure uma Unidade Básica de Saúde: o atendimento é gratuito e sigiloso.</p>
      <button class="btn btn-claro" type="button" data-fechar style="margin-top:14px">Fechar</button>`;
    corpo.querySelector("#q-titulo").focus();
  }

  function final() {
    M.umaVezPorSessao("teste_fim");
    const r = T.resultado(respostas), P = T.PERFIS[r.perfil];
    guardar("c21-perfil", r.perfil);
    const ALERTA = {
      erecao: "dificuldade de ereção",
      dor: "dor ou ardência",
      sangue: "sangue no sêmen ou na urina",
    };
    const sinais = r.alertas.filter(a => ALERTA[a]).map(a => ALERTA[a]);
    const comprar = C.checkout || whats(`Oi! Fiz o teste e deu perfil ${P.nome}. Quero o Controle 21.`);
    corpo.innerHTML = `
      <div class="q-topo"><button type="button" data-fechar>✕ Fechar</button><span>resultado · só você vê</span></div>
      <div class="perfil-card">
        <span class="rotulo">SEU PERFIL</span>
        <h2 tabindex="-1" id="q-titulo" style="margin-top:6px">${P.nome}</h2>
        <p><b>${P.frase}</b></p>
        <p style="color:var(--muted)">${P.explica}</p>
        <div class="medidor" aria-label="Composição do seu perfil">
          ${["a", "s", "h"].map(k => `<div>${T.PERFIS[k].nome}<span><i style="width:${r.parte[k]}%"></i></span></div>`).join("")}
        </div>
      </div>
      ${sinais.length ? `<div class="alerta"><h3>Antes do treino: procure um urologista</h3><p>Você marcou ${sinais.join(", ")}. Isso precisa ser visto por um médico, porque pode ter uma causa que o treino não resolve. Pelo SUS, comece pela Unidade Básica de Saúde.</p><p style="margin:0">O Controle 21 pode ser feito junto com o acompanhamento, mas não no lugar dele.</p></div>` : ""}
      ${r.alertas.includes("sempre") ? `<p class="aviso" style="margin-top:12px">Quando é assim desde as primeiras vezes e dura menos de 1 minuto, vale também conversar com um urologista: existe tratamento médico, e o treino ajuda junto com ele.</p>` : ""}
      <div class="cartao" style="margin-top:16px">
        <h3>O seu treino de 21 dias</h3>
        <ul class="lista">
          <li>Dias 1–7: encontrar o músculo e respirar devagar</li>
          <li>Dias 8–14: ganhar controle com parar e recomeçar</li>
          <li>Dias 15–21: levar o controle para a dois</li>
          <li>Foco extra no seu perfil: <b>${P.foco}</b></li>
        </ul>
        <div class="preco" style="margin-top:10px">R$ ${C.preco || "37,90"} <small>pagamento único · garantia de 7 dias</small></div>
        ${comprar ? `<a class="btn btn-lime" href="${comprar}" rel="noopener" data-comprar style="margin-top:12px">Quero começar hoje →</a>` : `<button class="btn btn-lime" type="button" disabled style="margin-top:12px">Vendas abrem em breve</button>`}
        <p class="q-ajuda" style="margin-top:10px">O acesso chega por e-mail na hora. Cobrança com nome neutro.</p>
      </div>
      <p class="q-ajuda" style="margin-top:14px">Este resultado é uma orientação de hábitos feita pela Maia, uma inteligência artificial. Não é diagnóstico médico.</p>`;
    corpo.querySelector("#q-titulo").focus();
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("button, a");
    if (!b) return;
    if (b.hasAttribute("data-comecar")) { e.preventDefault(); abrir(); }
    else if (b.hasAttribute("data-op")) escolher(+b.dataset.op);
    else if (b.hasAttribute("data-voltar")) { if (passo) { passo--; pergunta(); } else fechar(); }
    else if (b.hasAttribute("data-fechar")) fechar();
    else if (b.hasAttribute("data-comprar")) M.evento("clique_compra");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !quiz.hidden) fechar(); });
  if (location.hash === "#teste") abrir();
})();
