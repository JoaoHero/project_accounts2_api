const express = require('express');
app = express();
port = 8080

const db = require("./db/models");

// localhost:8080
app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});