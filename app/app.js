// Carica le variabili d'ambiente dal file .env
require('dotenv').config();

// Stampa la password del database (solo per debug, rimuovere in produzione)
console.log ("DB_Password is " + process.env.DB_PASSWORD);

// Importa ed inizializza Express
const express = require('express');
const app = express();

// Importa il middleware personalizzato e le rotte principali
const middleware = require("./main/middleware");
const routes = require("./routes/main-router");

// Applica i middleware all'app Express
middleware(app, express);
// Applica le rotte all'app Express
routes(app);

// Avvia il server sulla porta 3000
app.listen(3000);
console.log ("Server is running on port 3000");