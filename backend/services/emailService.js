require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.enviarBoleto = async ({ nome, email, pedido_id, boleto_url }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Boleto do pedido #${pedido_id}`,
    html: `
      <p>Olá ${nome},</p>
      <p>Segue o boleto para pagamento do seu pedido:</p>
      <p><a href="${boleto_url}" target="_blank">Clique aqui para visualizar o boleto</a></p>
      <p>Obrigado por comprar conosco!</p>
    `,
  });
};
