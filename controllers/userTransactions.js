// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();

// Importando a conexão com banco de dados
const db = require("../db/models");

const { eAdmin } = require("../middlewares/auth")
 
// Criando a rota para buscar as informações do usuário
router.get("/userTransactions", eAdmin, async(req, res) => {
    res.status(200).json({
        error: false,
        message: "Mostrando os dados do usuário!",
    })
});

module.exports = router;