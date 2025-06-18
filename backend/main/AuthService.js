

const passwordTools= require ('../common/passwordTools');
const User = require('../models/User');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');


class AuthService {

    static async verifyUser(username, password, done) {
        // Implementa la logica di autenticazione locale qui
        // Ad esempio, verifica le credenziali in un database
        console.log(`Autenticazione utente user: ${username} ...`);
        let user=await User.find(username);
        console.log(`Autenticazione utente user object: ${user} ...`);
        if (user && passwordTools.validatePassword(password, user.hash, user.salt) ) {
            // utente trovato, verifichiamo la password
            console.log(`Utente trovato e password corretta`);
            return done(null, { idx: user.idx, username: user.username, name: user.name , lastname: user.lastname, email: user.email }); // Simula un utente autenticato
        } else {
             // autenticazione fallita
            console.log(`autenticazione fallita`);
            return done(null, false, { message: 'Invalid credentials' });
        }
    }

    static async registerUser (username, password, name, lastname, email){
        let hashPass=passwordTools.generatePassword(password);
        let exists=await User.find(username);
        if (exists) {
            return null;
        }
        return User.create(username, name, lastname, email, hashPass.hash, hashPass.salt);
    }

}




module.exports =  AuthService;