// Carica le variabili d'ambiente dal file .env
require('dotenv').config();

// Stampa la password del database (solo per debug, rimuovere in produzione)
console.log ("DB_Password is " + process.env.DB_PASSWORD);

// Importa ed inizializza Express
const express = require('express');
const app = express();

// Importa i moduli necessari
const config = require('config');
const fs = require('fs'); // leggo i certificati

let filechiave = config.get("chiaveprivata");

const miachiave = fs.readFileSync(filechiave);
const miocert = fs.readFileSync(config.get("certificato"));
const credential = {key: miachiave, cert: miocert };

const https = require('https');
const http = require('http');
const secureServer = https.createServer({key: miachiave, cert: miocert }, app);
const unsecureServer = http.createServer(app);

app.set('views', './views');
app.set('view engine', 'ejs');

// Importa il middleware personalizzato e le rotte principali
const middleware = require("./main/middleware");
const routes = require("./routes/main-router");

// Applica i middleware all'app Express
middleware(app, express);
// Applica le rotte all'app Express
routes(app);




// Avvia il server sulla porta 3000
secureServer.listen(443, () => { console.log("Secure server is running on port 443"); });
unsecureServer.listen(80, () => { console.log("Secure server is running on port 80"); });

