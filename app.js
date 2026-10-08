// O app do treino. Tudo fica só neste aparelho (localStorage).
(function () {
  "use strict";
  const C = window.C21 || {};
  const P = window.C21Programa;
  const el = document.getElementById("app");
  const CHAVE = "c21-app";
  const NOMES = { a: "Ansiedade", s: "Sensibilidade", h: "Hábito" };

  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* segue sem salvar */ } }

  let est = { inicio: null, feitos: {}, perfil: ler("c21-perfil") || "", vibrar: true };
  try { const s = JSON.parse(ler(CHAVE)); if (s && typeof s === "object") est = Object.assign(est, s); } catch (e) { /* padrão */ }
  function salvar() { gravar(CHAVE, JSON.stringify(est)); }

  let toastT;
  function toast(m) { const t = document.getElementById("toast"); t.textContent = m; clearTimeout(toastT); toastT = setTimeout(() => { t.textContent = ""; }, 2600); }

  // ---------- Portão do código ----------
  const codigos = [C.codigo, C.codigoPlus].filter(Boolean).map(c => c.toUpperCase());
  function liberado() { const c = (ler("c21-acesso") || "").toUpperCase(); return codigos.includes(c); }

  function portao(erro) {
    el.innerHTML = `<div class="portao">
      <h1>Seu acesso</h1>
      <p style="color:var(--muted)">Digite o código que chegou no seu e-mail depois da compra.</p>
      <form id="f-codigo">
        <label for="codigo">Código de acesso</label>
        <input id="codigo" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="T21-XXXX">
        <p class="erro" role="alert">${erro || ""}</p>
        <button class="btn btn-lime" type="submit">Entrar</button>
      </form>
      <p class="q-ajuda" style="margin-top:16px">Ainda não comprou? <a href="./#teste">Faça o teste anônimo</a>.</p>
    </div>`;
    document.getElementById("f-codigo").addEventListener("submit", e => {
      e.preventDefault();
      const v = document.getElementById("codigo").value.trim().toUpperCase();
      if (codigos.includes(v)) { gravar("c21-acesso", v); iniciar(); }
      else portao("Código não confere. Confira no e-mail da compra.");
    });
  }

  // ---------- Perfil ----------
  function escolherPerfil() {
    el.innerHTML = `<div class="portao">
      <h1>Qual é o seu perfil?</h1>
      <p style="color:var(--muted)">Deu no teste. Se não lembra, escolha o que mais parece com você: dá para trocar depois.</p>
      <div class="opcoes">
        <button type="button" data-perfil="a"><b>Ansiedade</b><br><span class="q-ajuda">A cabeça acelera: fico preocupado em terminar rápido.</span></button>
        <button type="button" data-perfil="s"><b>Sensibilidade</b><br><span class="q-ajuda">Chega no ponto sem aviso.</span></button>
        <button type="button" data-perfil="h"><b>Hábito</b><br><span class="q-ajuda">Costumo fazer tudo com pressa.</span></button>
      </div>
    </div>`;
  }

  // ---------- Tela do dia ----------
  let aberto = 1;
  const hojeLiberado = () => P.diaLiberado(est.inicio, Date.now());

  function grade() {
    const lib = hojeLiberado();
    return `<div class="dias" role="group" aria-label="Os 21 dias">${Array.from({ length: P.total }, (_, i) => {
      const d = i + 1, feito = !!est.feitos[d];
      return `<button type="button" data-dia="${d}" class="${feito ? "feito" : ""}${d === aberto ? " hoje" : ""}" ${d > lib ? "disabled" : ""} aria-label="Dia ${d}${feito ? ", feito" : ""}${d > lib ? ", ainda bloqueado" : ""}" ${d === aberto ? 'aria-current="true"' : ""}>${feito ? "✓" : d}</button>`;
    }).join("")}</div>`;
  }

  function tela() {
    const t = P.diaDoTreino(aberto, est.perfil), s = t.serie;
    const feitos = Object.keys(est.feitos).length, lib = hojeLiberado();
    el.innerHTML = `
      <p style="margin:16px 0 0;color:var(--muted)">${feitos} de 21 dias feitos · perfil <button type="button" class="text-link" data-trocar style="background:none;border:0;color:var(--teal);font:inherit;cursor:pointer;padding:0;text-decoration:underline">${NOMES[est.perfil]}</button></p>
      ${grade()}
      <span class="fase">FASE ${t.fase.n} · ${t.fase.nome.toUpperCase()}</span>
      <h1 style="margin-top:4px">Dia ${t.dia}: ${t.titulo}</h1>
      <p style="color:var(--muted)">Cerca de ${t.minutos} minutos. ${t.fase.meta}</p>

      <section class="bloco-dia"><h3>🌬️ Respiração <span class="min">3 min</span></h3><p>${t.respiracao}</p></section>

      <section class="bloco-dia"><h3>💪 O músculo <span class="min">${s.vezes}× no dia</span></h3>
        <p>${s.reps} contrações de ${s.c} segundos, soltando ${s.r} segundos${s.rapidas ? `, e depois ${s.rapidas} contrações rápidas` : ""}. Sem prender o ar e sem apertar barriga, glúteos ou coxas.</p>
        <div class="timer" id="timer">
          <div class="anel" id="anel"><svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true"><circle class="fundo" cx="95" cy="95" r="84" fill="none" stroke-width="12"/><circle class="frente" id="arco" cx="95" cy="95" r="84" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="527.8" stroke-dashoffset="527.8"/></svg>
            <div class="centro"><span class="acao" id="t-acao" aria-live="assertive">Pronto?</span><span class="seg" id="t-seg"></span></div></div>
          <p class="reps" id="t-reps">${s.reps} repetições${s.rapidas ? ` + ${s.rapidas} rápidas` : ""}</p>
          <div class="linha-botoes"><button class="btn btn-lime" type="button" data-timer>▶ Começar</button><button class="btn btn-claro" type="button" data-parar hidden>■ Parar</button></div>
          <label style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:10px;font-size:14px;color:var(--muted)"><input type="checkbox" data-vibrar ${est.vibrar ? "checked" : ""}> Vibrar ao trocar (celular no silencioso)</label>
        </div>
      </section>

      <section class="bloco-dia"><h3>🎯 Tarefa do dia</h3><ol>${t.tarefa.map(p => `<li>${p}</li>`).join("")}</ol>
        ${t.dia === 2 ? escala() : ""}
        ${t.extra ? `<p class="aviso" style="margin:8px 0 0">${t.extra}</p>` : ""}
      </section>

      <section class="bloco-dia"><h3>🧠 Para a cabeça</h3><p style="margin:0">${t.cabeca}</p></section>

      <label class="check-dia"><input type="checkbox" data-feito ${est.feitos[t.dia] ? "checked" : ""}> Fiz o dia ${t.dia}</label>
      ${t.dia < 21 && t.dia + 1 > lib ? `<p class="q-ajuda" style="margin-top:10px">O dia ${t.dia + 1} abre amanhã. Um dia de cada vez: o músculo precisa de descanso.</p>` : ""}
      ${t.dia === 21 && est.feitos[21] ? plus() : ""}
      <p class="q-ajuda" style="margin:24px 0 32px">A Maia é uma inteligência artificial e não é médica. Dor, sangue ou dificuldade de ereção: procure um urologista. <a href="privacidade.html">Privacidade e termos</a></p>`;
  }

  function escala() {
    return `<div class="escala" aria-label="Escala de 0 a 10">${Array.from({ length: 11 }, (_, i) => `<span class="${i <= 4 ? "v" : i <= 7 ? "a" : "r"}">${i}</span>`).join("")}</div>
      <p class="q-ajuda">Verde: tranquilo. Amarelo: é aqui que você age. Vermelho: perto do ponto sem volta.</p>`;
  }

  function plus() {
    const temPlus = (ler("c21-acesso") || "").toUpperCase() === (C.codigoPlus || "").toUpperCase();
    if (temPlus) return `<a class="btn btn-lime" href="plus.html" style="margin-top:14px">Abrir o Plus: módulo casal + mais 30 dias →</a>`;
    if (!C.checkoutPlus) return "";
    return `<div class="cartao" style="margin-top:14px"><h3>Quer ir além?</h3><p>Plus: módulo casal com 5 lições e mais 30 dias de treino de manutenção. R$ ${C.precoPlus || "97"}.</p><a class="btn btn-lime" href="${C.checkoutPlus}" rel="noopener">Quero o Plus →</a></div>`;
  }

  // ---------- Cronômetro ----------
  let rel = null;
  function passos(s) {
    const l = [];
    for (let i = 0; i < s.reps; i++) { l.push(["Contraia", s.c, i + 1, s.reps]); l.push(["Solte", s.r, i + 1, s.reps]); }
    for (let i = 0; i < s.rapidas; i++) { l.push(["Rápido: aperta", 1, i + 1, s.rapidas]); l.push(["Solta", 1, i + 1, s.rapidas]); }
    return l;
  }
  function vibra(ms) { if (est.vibrar && navigator.vibrate) navigator.vibrate(ms); }
  function parar(fim) {
    clearInterval(rel); rel = null;
    const b = document.querySelector("[data-timer]"), p = document.querySelector("[data-parar]");
    if (b) { b.hidden = false; b.textContent = fim ? "↻ De novo" : "▶ Começar"; }
    if (p) p.hidden = true;
    if (fim) { document.getElementById("t-acao").textContent = "Feito!"; document.getElementById("t-seg").textContent = "série completa"; vibra([80, 60, 80]); }
  }
  function comecar() {
    const s = P.serie(aberto), l = passos(s), C2 = 527.8;
    let i = 0, ini = Date.now();
    const arco = document.getElementById("arco"), anel = document.getElementById("anel");
    document.querySelector("[data-timer]").hidden = true;
    document.querySelector("[data-parar]").hidden = false;
    const mostrar = () => {
      const [acao, seg, n, de] = l[i];
      document.getElementById("t-acao").textContent = acao;
      document.getElementById("t-reps").textContent = `${n} de ${de}`;
      anel.classList.toggle("solta", /Sol/.test(acao));
      vibra(acao === "Contraia" ? 120 : 40);
      return seg;
    };
    let dur = mostrar();
    rel = setInterval(() => {
      const t = (Date.now() - ini) / 1000;
      if (t >= dur) {
        i++;
        if (i >= l.length) { arco.style.strokeDashoffset = 0; return parar(true); }
        ini = Date.now(); dur = mostrar();
        return;
      }
      document.getElementById("t-seg").textContent = Math.ceil(dur - t) + " s";
      arco.style.strokeDashoffset = C2 * (1 - t / dur);
    }, 100);
  }

  // ---------- Eventos ----------
  document.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.perfil) { est.perfil = b.dataset.perfil; gravar("c21-perfil", est.perfil); salvar(); iniciar(); }
    else if (b.dataset.dia) { parar(); aberto = +b.dataset.dia; tela(); el.focus(); }
    else if (b.hasAttribute("data-timer")) comecar();
    else if (b.hasAttribute("data-parar")) parar();
    else if (b.hasAttribute("data-trocar")) { parar(); escolherPerfil(); }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.hasAttribute("data-feito")) {
      if (t.checked) est.feitos[aberto] = Date.now(); else delete est.feitos[aberto];
      salvar();
      toast(t.checked ? (aberto === 21 ? "21 dias! Você fez." : `Dia ${aberto} feito. Até amanhã!`) : "Desmarcado.");
      tela();
    }
    if (t.hasAttribute("data-vibrar")) { est.vibrar = t.checked; salvar(); }
  });

  function iniciar() {
    if (!liberado()) return portao();
    if (window.C21Metricas) window.C21Metricas.umaVezPorSessao("app_abriu");
    if (!est.perfil) return escolherPerfil();
    if (!est.inicio) { est.inicio = Date.now(); salvar(); }
    const lib = hojeLiberado();
    // Abre no primeiro dia liberado que ainda não foi feito.
    aberto = 1;
    for (let d = 1; d <= lib; d++) { aberto = d; if (!est.feitos[d]) break; }
    tela();
  }
  iniciar();
})();
