// Controller per la gestione delle operazioni sui libri
const BookService = require('../main/BookService');

class BookController {
    // Metodo per cercare libri tramite query string (autore, titolo)

    static async searchBooks(req, res) {
        console.log("SESSION: ", req.session);

        let autore = null;
        let titolo = null;
        // Controlla se è stato passato l'autore nella query
        if (req.query && req.query.autore) {
            autore = req.query.autore;
        }
        // Controlla se è stato passato il titolo nella query
        if (req.query && req.query.titolo) {
            titolo = req.query.titolo;
        }
        // Chiama il servizio per la ricerca dei libri
        let data = await BookService.search(autore, titolo);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.json(data);
        } else {
            res.render('listBook', { title: 'Libri', books: data });
        }

        //res.render('listBook', { title: 'Libri', books: data });
        //res.render('listBook', { title: 'Libri', books: data });
    };

    // Metodo per creare un nuovo libro
    static async createBook(req, res) {
        // Verifica che autore e titolo siano presenti nel body della richiesta
        if (!req.body || !req.body.autore || !req.body.titolo) {
            res.status(400).send("Errore: Devi specificare autore e titolo del libro");
            return;
        }
        let a = req.body.autore;
        let t = req.body.titolo;
        // Chiama il servizio per creare il libro
        const data = await BookService.create(a, t);
        if (!data) {
            res.status(500).send("Errore durante la creazione del libro");
            return;
        }
        res.json(data);

    };

    // Metodo per ottenere un libro tramite id
    static async getBook(req, res) {
        if (req.params && req.params.idlibro) {
            // Chiama il servizio per ottenere il libro tramite id
            const theBook = await BookService.getBookById(req.params.idlibro);
            if (!theBook) {
                res.status(404);
                res.send("Libro non trovato");
                return;
            }
            res.json(theBook);
        } else {
            res.status(400);
            res.send("Bas Request: Devi specificare l'ID del libro");
        }
    };

    // Metodo per aggiornare un libro tramite id
    static async updateBook(req, res) {
        // Verifica che idlibro, author e title siano presenti
        if (req.params && req.params.idlibro && req.body && req.body.author && req.body.title) {
            // Chiama il servizio per aggiornare il libro
            const theBook = await BookService.update(req.params.idlibro, req.body.author, req.body.title);
            if (!theBook) {
                res.status(404);
                res.send("Libro non trovato");
                return;
            }
            res.json(theBook);
        } else {
            res.status(400);
            res.send("Bas Request: Devi specificare l'ID (" + req.params.idlibro + ") del libro il nuovo titolo (" + req.body.title + ") e l'autore (" + req.body.author + ")");
        }

    };

    // Metodo per cancellare un libro tramite id
    static async deleteBook(req, res) {
        if (req.params && req.params.idlibro) {
            // Chiama il servizio per cancellare il libro
            const theBook = await BookService.delete(req.params.idlibro);
            if (!theBook) {
                res.status(404);
                res.send("Libro non trovato");
                return;
            }
            res.send("Libro cancellato");
        } else {
            res.status(400);
            res.send("Bas Request: Devi specificare l'ID del libro");
        }
    };

    static async testsession(req, res) {
        res.send("Test sessione eseguito con successo"+ JSON.stringify(req.session));
    };

}

// Esporta il controller per l'utilizzo nelle route
module.exports = BookController;