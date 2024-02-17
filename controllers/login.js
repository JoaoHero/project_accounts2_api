// Inicializando o express
const express = require('express');
// Chamando rotas do express
const router = express.Router();

// Importando a conexão com banco de dados
const db = require("../db/models");

// Criando a rota login
router.post("/login", async(req, res) => {
    console.log("Acessou a rota post!")
});

module.exports = router;