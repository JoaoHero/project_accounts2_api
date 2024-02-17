// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();
// Importando o modulo de hash de senhas
const bcrypt = require('bcrypt');

// Importando a conexão com banco de dados
const db = require("../db/models");

// Criando a rota login
router.post("/login", async(req, res) => {

    try {

        // Obtendo os dados destruturados do corpo da requisição
        const { email, password } = req.body;

        // Buscando o e-mail no banco de dados e comparando com o que foi informado na requisição
        const user = await db.Users.findOne({
            attributes: ["email", "password", "validationCode"],
            where: { email: email }
        });

        // Caso não encontre nenhum e-mail cadastrado
        if(!user) {
            // Parar o processamento e retornar o código de erro
            return res.status(404).json({
                error: true,
                message: "E-mail ou senha inválida"
            });
        };

        // Compara a senha cadastrada com a senha informada na requisição (senha cadastrada já criptografada)
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        // Caso a senhas não forem iguais
        if(!passwordMatch) {
            // Parar o processamento e retornar o código de erro
            return res.status(404).json({
                error: true,
                message: "Email ou senha inválidos"
            });
        };

        if(user.validationCode === "validated") {
            return res.status(404).json({
                error: true,
                message: "Necessário validar o E-mail"
            });
        };

        // Parar o processamento e retornar o código de sucesso
        return res.status(200).json({
            error: false,
            message: "Usuário encontrado, logando..."
        });

    // Capturar erro no try catch
    }catch(err) {
        return res.status(400).json({
            error: true,
            message: "Erro ao tentar fazer login",
            moreInformation: err.message
        });
    };

});

module.exports = router;