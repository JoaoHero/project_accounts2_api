// Inicializando o express
const express = require('express');
const cors = require("cors");
// Criando o app com o express
app = express();
// Especificando a porta sendo utilizada
port = 8080

// Middleware para permitir requisições CORS
app.use(cors());

// Importando as controllers
loginRouter = require("./controllers/login");
registerRouter = require("./controllers/register");
confirmEmailRouter = require("./controllers/validateEmail");
userTransactions = require("./controllers/userTransactions");

// Middlewares
app.use(express.json())

// Rotas
app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", confirmEmailRouter);
app.use("/", userTransactions);

// Servidor rodando na porta: localhost:8080
app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});