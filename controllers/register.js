// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();
// Importando o modulo de hash de senhas
const bcrypt = require('bcrypt');
// Define o número de rounds de salt (geralmente entre 10 e 12)
const saltRounds = 10; 
// Importando o operador lógico do sequelize
const { Op } = require('sequelize');

// Função para gerar um código de confirmação de e-mail
const generateEmailCode = require("../utils/generateCode");
// Função para enviar o e-mail
const sendEmail = require("../utils/sendEmail");
// Função para validar se o formato do e-mail é correto
const validate = require("../utils/validation");

// Importando a conexão com banco de dados
const db = require("../db/models");

// Criando a rota login
router.post("/register", async(req, res) => {

    // Capturando as informações da requisição
    let user = req.body;

    // Validando se foi informado todos os campos
    if(!user.name || !user.email || !user.password || !user.cpf) {
        // Parar o processamento e retornar um código de erro
        return res.status(404).json({
            error: true,
            message: "Todos os dados são obrigatórios!"
        });
    };

    // Validando se o e-mail segue o padrão correto
    if(validate.email(user.email).conditions.error) {
        // Parar o processamento e retornar um código de erro
        return res.status(404).json({
            error: true,
            message: "Email inválido!"
        });
    };

    // Validando a força da senha do usuário
    if(validate.password(user.password).conditions.error) {
        // Atribuindo a mensagem de erro da função a uma váriavel
        const errorMessage = validate.password(user.password).conditions.message;

        // Parar o processamento e retornar um código de erro
        return res.status(404).json({
            error: true,
            message: `Senha inválida: ${errorMessage}`
        });
    };

    if(validate.cpf(user.cpf).conditions.error) {
        // Parar o processamento e retornar um código de erro
        return res.status(404).json({
            error: true,
            message: "Número de CPF inválido!"
        });
    };

    // Validando se o e-mail já foi cadastrado
    const checkUserInformation = await db.Users.findOne({
        attributes: ["cpf", "email"],
        where: {
            // Validando se o e-mail ou o cpf já foi cadastrado
            [Op.or]: [
                { email: user.email },
                {cpf: user.cpf }
            ]
        }
    });

    // Se o e-mail já foi cadastrado
    if(checkUserInformation) {
        if (checkUserInformation.email === user.email) {
            return res.status(400).json({
                error: true,
                message: "Email já cadastrado!"
            });
        } else {
            return res.status(400).json({
                error: true,
                message: "Cpf já cadastrado!"
            });
        };
    };

    // Aguardar a criptografia da senha
    user.password = await bcrypt.hash(user.password, saltRounds);
    // Gerar um código de acesso e salvar no banco de dados para comparar
    user.validationCode = generateEmailCode();
    // Enviar o e-mail contendo a URL da rota e o código de acesso

    // Criando o usuário no banco de dados
    await db.Users.create(user);

    // Chamando a função de enviar o e-mail com o código de validação
    sendEmail(user.email, user.validationCode);

    // Parar o processamento e retornar um código de sucesso
    return res.status(201).json({
        error: false,
        message: "Conta criada com sucesso, favor validar o e-mail."
    });
});

module.exports = router;