// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();

// Importando a conexão com banco de dados
const db = require("../db/models");

const { eAdmin } = require("../middlewares/auth");
 
// Criando a rota para buscar o saldo do usuário
router.get("/userTransactions", eAdmin, async(req, res) => {

    try {
        // Obtendo o id do usuário pelo token
        const userId = req.user.id;

        // Buscando o saldo do usuário no banco de dados
        const userBalance = await db.Users.findOne({
            attributes: ["balance"],
            where: { id: userId }
        });

        // Caso não encontrar o saldo do usuário
        if(!userBalance) {
            // Parar o processamento e retornar o código de erro
            return res.status(404).json({
                error: true,
                message: "Erro ao encontrar o saldo",
                balance: "carregando..."
            });
        };

        // Atribuindo o saldo do usuário a nova variável
        balance = userBalance.dataValues.balance

        // Parar o processamento e retornar o código de sucesso
        return res.status(200).json({
            error: false,
            message: "Saldo do usuário encontrado",
            balance: balance
        });

    }catch(err) {
        console.error("Erro ao tentar procurar o saldo do usuário, erro:", err);

        // Parar o processamento e retornar o código de erro
        return res.status(500).json({
            error: true,
            message: "Erro ao encontrar o saldo. Tente novamente mais tarde.",
            balance: "carregando..."
        });
    }
});


// Criando rota para depósito do usuário
router.post("/userTransactions/deposit", eAdmin, async(req, res) => {
    try {
        // Obtendo o id do usuário pelo token
        const userId = req.user.id;
        // Capturando o valor de depósito enviado pelo corpo da requisição
        let { value } = req.body;

        if(!value) {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "é necessário informar um valor!"
            });
        };

        if(value < 0) {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Número negativos não são permitidos!"
            });
        };

        // Validando se o tipo de dado inserido é um número ou string
        if(typeof value != "number") {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Enviar apenas números!"
            });

        }else {
            // Buscando o saldo do usuário no banco de dados
            let userBalance = await db.Users.findOne({
                attributes: ["balance"],
                where: {id: userId}
            });

            // Atribuindo o saldo do usuário a nova variável
            const { balance } = userBalance.dataValues;
            // Realizando a soma do saldo em conta mais o valor novo
            const newBalance = balance + value;

            // Atualizando o campo do saldo no banco de dados
            const update = await db.Users.update(
                { balance: newBalance },
                { where: {id: userId }}
            );

            // Validando se houve alteração no banco de dados
            if(update != 0 ) {
                // Parar o processamento e retornar o código de sucesso
                return res.status(200).json({
                    error: false,
                    message: "Depósito realizado com sucesso."
                });
            }else {
                // Parar o processamento e retornar o código de erro
                return res.status(404).json({
                    error: true,
                    message: "Não foi possível realizar o depósito."
                });
            };
        };

    }catch(err) {
        console.error("Erro ao tentar fazer o depósito, erro:", err);
        // Parar o processamento e retornar o código de erro
        return res.status(500).json({
            error: true,
            message: "Erro ao tentar fazer o depósito. Tente novamente mais tarde.",
        });
    };
});

module.exports = router;