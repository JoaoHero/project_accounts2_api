// Incluindo arquivo com variáveis de ambiente
require("dotenv").config();
const generateEmailCode = require("./generateCode");

const nodemailer = require("nodemailer");


async function sendEmail(emailTo) {

    securityCode = generateEmailCode();

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_USER_PASS,
        },
    });

    const message = {
        from: "joao.silvaramos2013@hotmail.com",
        to: emailTo,
        subject: "Código de verificação",
        text: `Segue seu código de segurança: ${securityCode}`,
        html: `Segue seu código de segurança: ${securityCode}`
    };

    transporter.sendMail(message, function (err) {
        if(err) {
            console.log("Ocorreu um erro ao enviar o email:", err);
        }

        console.log("Email enviado com sucesso");
    });
};

module.exports = sendEmail;