// Importa a biblioteca web-push para envio de notificações push
const webpush = require('web-push');

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// As chaves VAPID devem estar definidas no arquivo .env:
// VAPID_PUBLIC_KEY=...
// VAPID_PRIVATE_KEY=...

// Configura os detalhes VAPID para autenticação com o serviço de push
webpush.setVapidDetails(
  'mailto:admin@polytec.com', // Email de contato do administrador
  process.env.VAPID_PUBLIC_KEY, // Chave pública VAPID
  process.env.VAPID_PRIVATE_KEY // Chave privada VAPID
);

/**
 * Envia uma notificação push para um cliente inscrito
 * @param {Object} subscription - Objeto de inscrição retornado pelo PushManager do navegador
 * @param {Object} payload - Objeto com os dados da notificação (ex: título, corpo, ícone)
 * @returns {Promise} - Resultado da tentativa de envio
 */
function enviarNotificacao(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload))
    .then(() => {
      console.log('✅ Notificação enviada com sucesso');
    })
    .catch(err => {
      console.error('❌ Erro ao enviar notificação:', err);
    });
}

// Exporta a função para uso em outras partes do backend