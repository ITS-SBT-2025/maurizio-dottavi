// Importa i moduli necessari
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// Funzione middleware per configurare l'app Express
function middleware(app,express) {
    // Serve file statici dalla cartella public, con estensione html di default
    //console.log("DEBUG:" + path.join(__dirname, "/../public"))
    app.use("/", express.static(path.join(__dirname, "/../public"), { "extensions": ["html"] }));
    // Abilita la lettura dei dati urlencoded (form)
    app.use(express.urlencoded());
    // Abilita la lettura dei dati JSON nel body delle richieste
    app.use(express.json());

    // Abilita la gestione dei cookie
    app.use(cookieParser());
    // Abilita il logging delle richieste HTTP
    app.use(morgan("combined"));
    // Abilita alcune protezioni di sicurezza HTTP
    app.use(helmet());
   
}

// Esporta la funzione middleware per l'utilizzo nell'applicazione principale
module.exports = middleware;