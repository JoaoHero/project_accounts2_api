// Inicializando o express
const express = require('express');
const cors = require("cors");
// Criando o app com o express
app = express();
// Especificando a porta sendo utilizada
port = 8080

// Criar o middleware para permitir requisição externa
app.use((req, res, next) => {

    // Qualquer endereço pode fazer requisição "*"
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");

    // Tipos de método que a API aceita
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    // Permitir o envio de dados para API
    res.header("Access-Control-Allow-Headers", "Content-Type");

    // Executar o cors
    app.use(cors());

    // Quando não houver erro deve continuar o processamento
    next();
});

// Importando as controllers
loginRouter = require("./controllers/login");
registerRouter = require("./controllers/register");
confirmEmailRouter = require("./controllers/validateEmail");

// Middlewares
app.use(express.json())

// Rotas
app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", confirmEmailRouter);

// Servidor rodando na porta: localhost:8080
app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});