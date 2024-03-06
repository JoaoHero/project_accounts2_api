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

        // Validar se o valor informado para o pix não é um valor negativo
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


// Criando rota para pix do usuário
router.post("/userTransactions/pix", eAdmin, async(req, res) => {

    try {
        //  Obtendo o valor do pix pela requisição
        const { value } = req.body;
        //  Obtendo o email do usuário pela requisição
        const { email } = req.body;
        //  Obtendo o id do usuário pelo token
        const userId = req.user.id;

        // Validar se todos os campos foram preenchidos
        if(!value || !email) {
            return res.status(404).json({
                error: true,
                message: "Necessário preencher todos os campos!"
            });
        };

        // Validar se o valor informado para o pix não é um valor negativo
        if(value < 0) {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Número negativos não são permitidos!"
            });
        };

        // Validando se o tipo do dado em value inserido é um número ou string
        if(typeof value != "number") {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Enviar apenas números!"
            });
        }else {
            // Buscando o saldo do usuário no banco de dados
            const userBalance = await db.Users.findOne({
                attributes: ["balance"],
                where: { id: userId }
            });

            // Salvando o saldo do usuário em uma variável
            const { balance } = userBalance.dataValues

            // Buscando o ID e o SALDO do usuário que será enviado o pix
            const accountPix = await db.Users.findOne({
                attributes: ["id", "balance"],
                where: { email: email }
            });

            // Validando se a conta do usuário que será enviado o pix foi encontrada
            if(!accountPix) {
                // Parar o processamento e retornar o código de erro
                return res.status(404).json({
                    error: true,
                    message: "Conta não encontrada!"
                });
            };

            // Validando se o valor inserido ao pix não é maior do que o saldo em conta
            if(value > balance) {
                // Parar o processamento e retornar o código de erro
                return res.status(400).json({
                    error: true,
                    message: "Saldo insuficitente para completar a solicitação"
                });
            };

            // Salvando o SALDO do usuário que será enviado o pix em uma variável
            const accountPixBalance = accountPix.dataValues.balance;
            // Salvando o ID do usuário que será enviado o pix em uma variável
            const accountPixId = accountPix.dataValues.id;

            // Operação do novo saldo do usuário que está solicitando a transação
            const newBalance = balance - value;

            // Operação do novo saldo para conta do usuário que irá o pix
            const newAccountPixBalance = accountPixBalance + value;

            // Realizando a atualização do novo saldo do usuário que solicitou a transação
            let update = await db.Users.update(
                { balance: newBalance },
                { where: {id: userId} }
            );

            // Realizando a atualização do novo saldo para a conta do usuário que foi enviado o pix
            let update2 = await db.Users.update(
                { balance: newAccountPixBalance },
                {where: {id: accountPixId }},
            );

            // Validando se teve alguma alteração na operação de update
            if(update != 0 && update2 != 0) {
                return res.status(200).json({
                    error: false,
                    message: "Pix realizado com sucesso."
                });
            }else {
                // Parar o processamento e retornar o código de erro
                return res.status(404).json({
                    error: true,
                    message: "Não foi possível realizar o pix."
                });
            };
        };

    }catch(err) {
        console.error("Erro ao tentar fazer o pix, erro:", err);
        // Parar o processamento e retornar o código de erro
        return res.status(500).json({
            error: true,
            message: "Erro ao tentar fazer o pix. Tente novamente mais tarde.",
        });
    };
});

// Criando rota de pagar
router.post("/userTransactions/pay", eAdmin, async(req, res) => {

    try {
        //  Obtendo o id do usuário que solicitou a requisição
        const userID = req.user.id;
        //  Obtendo o valor da fatura pela requisição
        const { value } = req.body;

        // Validar se todos os campos foram preenchidos
        if(!value) {
            // Parar o processamento e retornar o código de erro
            return res.status(404).json({
                error: true,
                message: "Necessário informar o valor da fatura"
            });
        };

        // Validar se o valor informado para o pix não é um valor negativo
        if(value < 0) {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Número negativos não são permitidos!"
            });
        };

        // Validando se o tipo do dado em value inserido é um número ou string
        if(typeof value != "number") {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Enviar apenas números!!"
            });
        }else {
            // Buscando o saldo do usuário no banco de dados
            const userBalance = await db.Users.findOne({
                attributes: ["balance"],
                where: { id: userID }
            });

            let { balance } = userBalance.dataValues

            // Validando se o valor inserido ao pix não é maior do que o saldo em conta
            if(value > balance) {
                // Parar o processamento e retornar o código de erro
                return res.status(400).json({
                    error: true,
                    message: "Saldo insuficitente para completar a solicitação"
                });
            };

            // Operação do novo saldo do usuário que está solicitando a transação
            const newBalance = balance - value

            const update = await db.Users.update(
                { balance: newBalance },
                { where: { id: userID }}
            );

            // Validando se houve alteração no banco de dados
            if(update != 0 ) {
                // Parar o processamento e retornar o código de sucesso
                return res.status(200).json({
                    error: false,
                    message: "Pagamento realizado com sucesso."
                });
            }else {
                // Parar o processamento e retornar o código de erro
                return res.status(404).json({
                    error: true,
                    message: "Não foi possível realizar o seu pagamento."
                });
            };
        };

    }catch(err) {
        console.error("Erro ao tentar fazer o pix, erro:", err);
        // Parar o processamento e retornar o código de erro
        return res.status(500).json({
            error: true,
            message: "Erro ao tentar efetuar o pagamento da sua conta. Tente novamente mais tarde.",
        });
    };
});

// Criando a rota de empréstimo
router.post("/userTransactions/loan", eAdmin, async(req, res) => {

    try {
        //  Obtendo o id do usuário que solicitou a requisição
        const userID = req.user.id;
        //  Obtendo o valor do empréstimo pela requisição
        const { value } = req.body;
        // Setando o limite do empréstimo
        const limitLoan = 10000

        // Validar se todos os campos foram preenchidos
        if(!value) {
            // Parar o processamento e retornar o código de erro
            return res.status(404).json({
                error: true,
                message: "Necessário informar o valor da fatura"
            });
        };

        // Validar se o valor informado para o empréstimo não é um valor negativo
        if(value < 0) {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Número negativos não são permitidos!"
            });
        };

        // Validando se o tipo do dado em value inserido é um número ou string
        if(typeof value != "number") {
            // Parar o processamento e retornar o código de erro
            return res.status(400).json({
                error: true,
                message: "Enviar apenas números!!"
            });
        }else {
            // Validando se o valor informado para o empréstimo não é maior do que o limite estabelecido
            if(value > limitLoan) {
                // Parar o processamento e retornar o código de erro
                return res.status(400).json({
                    error: true,
                    message: "Valor do limite máximo de empréstimo ultrapassado!"
                });
            };

            // Buscando o saldo do usuário no banco de dados
            const userBalance = await db.Users.findOne({
                attributes: ["balance"],
                where: { id: userID }
            });

            // Atribuindo o saldo do usuário a uma variável
            let { balance } = userBalance.dataValues;

            const newBalance = balance + value;

            const update = await db.Users.update(
                { balance: newBalance },
                {where: { id: userID }}
            );

            // Validando se houve alteração no banco de dados
            if(update != 0 ) {
                // Parar o processamento e retornar o código de sucesso
                return res.status(200).json({
                    error: false,
                    message: "Empréstimo realizado com sucesso."
                });
            }else {
                // Parar o processamento e retornar o código de erro
                return res.status(404).json({
                    error: true,
                    message: "Não foi possível realizar o seu empréstimo."
                });
            };
        };
    }catch(err) {
        console.error("Erro ao tentar fazer o pix, erro:", err);
        // Parar o processamento e retornar o código de erro
        return res.status(500).json({
            error: true,
            message: "Erro ao tentar efetuar o pagamento da sua conta. Tente novamente mais tarde.",
        });
    };
});

module.exports = router;