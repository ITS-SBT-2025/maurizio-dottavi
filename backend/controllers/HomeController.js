// Controller per la gestione delle operazioni sui libri

class HomeController {
    // Metodo per cercare libri tramite query string (autore, titolo)
    static async home(req, res, next) {
        res.render("home", { user: req.user } );
    };


}

// Esporta il controller per l'utilizzo nelle route
module.exports = HomeController;