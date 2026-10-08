// Conta as etapas do funil, sem dado pessoal: só o nome da etapa e a origem
// (?o=ig, ?o=tt, ?o=af-nome...). A origem fica guardada no aparelho para a
// compra, que acontece depois na Cakto, contar para o canal certo.
(function () {
  "use strict";
  var C = window.C21 || {};
  function ler(k, area) { try { return (area || localStorage).getItem(k); } catch (e) { return null; } }
  function gravar(k, v, area) { try { (area || localStorage).setItem(k, v); } catch (e) { /* segue */ } }

  var daUrl = new URLSearchParams(location.search).get("o");
  if (daUrl) gravar("c21-origem", daUrl.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20));

  function enviar(evento) {
    if (!C.metricas) return;
    var corpo = JSON.stringify({ e: evento, o: ler("c21-origem") || "direto" });
    try {
      // text/plain não pede licença (CORS) ao servidor: sai mesmo se a página fechar.
      if (navigator.sendBeacon && navigator.sendBeacon(C.metricas + "/e", new Blob([corpo], { type: "text/plain" }))) return;
    } catch (e) { /* tenta o fetch */ }
    try { fetch(C.metricas + "/e", { method: "POST", body: corpo, keepalive: true, mode: "no-cors" }); } catch (e) { /* sem métrica, sem problema */ }
  }

  window.C21Metricas = {
    // Conta uma vez por sessão (visita) ou por aparelho (compra), para recarregar a página não inflar.
    evento: enviar,
    umaVezPorSessao: function (evento) {
      if (ler("c21-m-" + evento, sessionStorage)) return;
      gravar("c21-m-" + evento, "1", sessionStorage);
      enviar(evento);
    },
    umaVezPorAparelho: function (evento) {
      if (ler("c21-m-" + evento)) return;
      gravar("c21-m-" + evento, "1");
      enviar(evento);
    },
  };
})();
