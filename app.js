// Inicializando o express
const express = require('express');
// Criando o app com o express
app = express();
// Especificando a porta sendo utilizada
port = 8080

// Importando as controllers
loginRouter = require("./controllers/login")
registerRouter = require("./controllers/register")

// Middlewares
app.use(express.json())

// Rotas
app.use("/", loginRouter);
app.use("/", registerRouter);

// Servidor rodando na porta: localhost:8080
app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});