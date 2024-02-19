// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();
// Importando o modulo de hash de senhas
const bcrypt = require('bcrypt');
const saltRounds = 10; // Define o número de rounds de salt (geralmente entre 10 e 12)

const generateEmailCode = require("../utils/generateCode")

// Importando a conexão com banco de dados
const db = require("../db/models");

// Criando a rota login
router.post("/register", async(req, res) => {

    // Capturando as informações da requisição
    let user = req.body;

    // Validando se foi informado todos os campos
    if(!user.name || !user.email || !user.password || !user.cpf) {
        return res.status(404).json({
            error: true,
            message: "Todos os dados são obrigatórios!"
        });
    };

    // Validando se o e-mail já foi cadastrado
    const checkEmail = await db.Users.findOne({
        attributes: ["email"],
        where: { email: user.email }
    });

    // Se o e-mail já foi cadastrado
    if(checkEmail) {
        // Parar o processamento e retornar um código de erro
        return res.status(400).json({
            error: true,
            message: "E-mail já cadastrado!"
        });
    };

    // Aguardar a criptografia da senha
    user.password = await bcrypt.hash(user.password, saltRounds);
    // Gerar um código de acesso e salvar no banco de dados para comparar
    user.validationCode = generateEmailCode();
    // Enviar o e-mail contendo a URL da rota e o código de acesso

    // Criando o usuário no banco de dados
    await db.Users.create(user);

    // Parar o processamento e retornar um código de sucesso
    return res.status(201).json({
        error: false,
        message: "Conta criada com sucesso, favor validar o e-mail."
    });

});

module.exports = router;