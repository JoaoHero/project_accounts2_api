// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();

// Importando a conexão com banco de dados
const db = require("../db/models");

// Criando a rota de validação do e-mail
router.post("/confirm-email", async(req, res) => {

    // Obtendo os dados destruturados do corpo da requisição
    const { emailCode } = req.body;

    // Comparando o código informado com o salvo no banco de dados
    userCode = await db.Users.findOne({
        attributes: ["validationCode"],
        where: {validationCode: emailCode}
    });

    // Validando se foi encontrado um código
    if(!userCode) {
        // Parando o processamento e informando o erro
        return res.status(404).json({
            error: true,
            message: "Código de e-mail invalido!"
        });
    };

    // Atualizando o campo do código do banco de dados para o status VALIDADO
    newUserCode = await db.Users.update(
        {validationCode: "validated"},
        {where: {validationCode: emailCode}}
    );

    // Parando o processamento e informando a mensagem de sucesso
    return res.status(200).json({
        error: false,
        message: "E-mail validado, seguindo com o login"
    });

});


module.exports = router;