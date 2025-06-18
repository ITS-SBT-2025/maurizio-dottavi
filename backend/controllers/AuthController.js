// Controller per la gestione delle operazioni sui libri
const AuthService = require('../main/AuthService');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// funzione che salva i dati di user nella sessione
// puo' anche essere solo l'id utente
// Salva solo le informazioni necessarie dell'utente in req.session.passport.user
passport.serializeUser(function(user, done) {
    done(null, { idx: user.idx, username: user.username, name: user.name, lastname: user.lastname, email: user.email }); 
});

// funzione che rende disponibile i dati dell'utente nella request (req.user)
passport.deserializeUser(function(user, done) {
    return done(null, user);
});

passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
        }, AuthService.verifyUser));    // Azione invocata per autenticare l'utente (quando la request contiene username e password)



class AuthController {
    // Metodo per cercare libri tramite query string (autore, titolo)
    static async login(req, res, next) {

        if (!req.body || !req.body.username || !req.body.password) {
            res.status(400).send("Errore: Devi specificare username e password");
            return;
        }
       passport.authenticate('local',{
        successRedirect: '/home',
        failureRedirect: '/login'
        })(req, res, next); // Invoca la strategia di autenticazione locale
                                // Function req.login called by passport.authenticate when authentication ends
                                /*            
            (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            req.user = user; // Salva l'utente nella richiesta
            const token = AuthService.generateToken(user); // Genera il token JWT
            return res.json({ user, token }); // Risponde con l'utente e il token
        })(req, res, next);
        */
    };

    static async loginPage(req, res, next) {
        res.render("loginPage");
    }

    static async registerPage(req, res, next) {
        res.render("registerPage");
    }

    static async register(req, res, next) {

        if (!req.body.username || !req.body.password || !req.body.name || !req.body.lastname || !req.body.email) {
            res.status(400).send ("Tutti i dati sono obbligatori");
        }
        await AuthService.registerUser(req.body.username , req.body.password, req.body.name , req.body.lastname, req.body.email);
        res.redirect("/login");
    }


    static async logout(req, res, next) {
      req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
    };

    static async isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            // L'utente è autenticato
            return next();
        } else {
            // L'utente non è autenticato, reindirizza alla pagina di login
            res.redirect('/login');
        }
    };


}

// Esporta il controller per l'utilizzo nelle route
module.exports = AuthController;