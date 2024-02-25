// Incluindo arquivo com variáveis de ambiente
require("dotenv").config();
const generateEmailCode = require("./generateCode");

const nodemailer = require("nodemailer");


async function sendEmail(emailTo, userCode) {

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
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
        text: `Segue seu código de segurança: ${userCode}`,
        html: `
            <head>
                <style>
                    body {
                        background-color: #ececec; /* Fundo cinza claro */
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                    }
                    .container-wrapper {
                        width: 40rem;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        background-color: #fff; /* Cor de fundo branca */
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra */
                    }
                    .container-wrapper > p {
                        h1, p {
                            text-align: center; /* Centralizar o texto */
                        }
                    }

                    #code {
                        font-size: 2rem;
                        color: blue;
                        text-align: center;
                        margin-top: 3rem;
                    }

                    #btn {
                        display: inline-block;
                        padding: 10px 20px;
                        border-radius: 0.5rem;
                        background-color: #6C63FF;
                        color: #FFFF;
                        font-weight: bold;
                        cursor: pointer;
                        margin-bottom: 3rem;
                    }
                </style>
            </head>
            <body>
                <div class="container-wrapper">
                    <h3>Segue seu código de segurança</h3>
                    <p>Por favor, copie e cole este código para logar na sua conta!</p>
                    <p id="code">${userCode}</p>
                    <br>
                    <p>Caso não tenha aberto a página, clique no botão abaixo</p>
                    <a id="btn" href="http://localhost:3000/confirm-email">Validar E-mail</a>
                </div>
            </body>
        `
    };

    transporter.sendMail(message, function (err) {
        if(err) {
            console.log(`Ocorreu um erro ao enviar a sua mensagem, erro: ${err}`);
        }
        console.log("Email enviado com sucesso");
    });
};

module.exports = sendEmail;