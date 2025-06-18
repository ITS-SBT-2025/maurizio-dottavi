// Importa i moduli necessari
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');

const SQLiteStore = require('connect-sqlite3')(session); 

const AuthController = require('../controllers/AuthController');

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

    
    app.use(session({
        //  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
        secret: 'il mio segreto di pulcinella',
        resave: false,
        saveUninitialized: false,
        name: 'TOKEN',
        store: new SQLiteStore({ db: 'sessions.db', dir: './data/' })
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    function sessionMonitor(req, res, next) {
        console.log("SESSION: ", req.session);
        console.log("USER: ", req.user);
        /*
        if (typeof(req.session.views) !== 'undefined') {
            req.session.views++;
        } else {
            req.session.views = 1;
        }    
        if (typeof(req.session.pageview) !== 'undefined') {
            req.session.views++;
            req.session.pageview.push(req.url);
        } else {
            req.session.pageview = [req.url];
        }
            */
        next();    
    }

    // Middleware per monitorare le sessioni
    app.use(sessionMonitor); 

    //app.use(AuthController.isAuthenticated); // Middleware per verificare l'autenticazione dell'utente
   
}

// Esporta la funzione middleware per l'utilizzo nell'applicazione principale
module.exports = middleware;