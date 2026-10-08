// ÚNICO arquivo que você precisa mexer.
// Depois de editar, publique de novo (o site lê daqui).
window.C21 = {
  // Link do checkout da Cakto do Controle 21 (R$37,90).
  // Vazio = o botão abre o WhatsApp e você cobra por Pix na mão.
  checkout: "https://pay.cakto.com.br/7x4ai4j_1181412",

  // Link do checkout da Cakto do Plus (módulo casal + mais 30 dias, R$97). Vazio = WhatsApp.
  checkoutPlus: "https://pay.cakto.com.br/um35jhw_1181424",

  // WhatsApp de atendimento, só números, com 55 e DDD. Vazio = esconde o botão.
  whatsapp: "",

  // Códigos de acesso. Na Cakto, a "entrega por e-mail" manda o link
  // obrigado.html?c=CODIGO (ou plus.html?c=CODIGO_PLUS para o Plus).
  // Trocar o código bloqueia quem tinha o antigo só no aparelho novo.
  codigo: "T21-THEO",
  codigoPlus: "T21-PLUS",

  // Contador do funil (Cloudflare, grátis). Vazio = não conta nada.
  metricas: "https://treino21-metricas.juliadiasfr.workers.dev",

  preco: "37,90",
  precoPlus: "97",
};
