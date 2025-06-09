const BookService = require('../main/BookService');

class BookController {
    static async searchBooks(req, res) {
        let autore = null;
        let titolo = null;
        if (req.query && req.query.autore) {
            autore = req.query.autore;
        }
        if (req.query && req.query.titolo) {
            titolo = req.query.titolo;
        }
        let data = await BookService.search(autore, titolo);
        res.json(data);
    };

    static async createBook(req, res) {
        if (!req.body || !req.body.autore || !req.body.titolo) {
            res.status(400).send("Errore: Devi specificare autore e titolo del libro");
            return;
        }
        let a = req.body.autore;
        let t = req.body.titolo;
        const data = await BookService.create(a, t);
        if (!data) {
            res.status(500).send("Errore durante la creazione del libro");
            return;
        }
        res.json(data);

    };

    static async getBook(req, res) {
        if (req.params && req.params.idlibro) {
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

    static async updateBook(req, res) {
        if (req.params && req.params.idlibro && req.body && req.body.author && req.body.title) {
            const theBook = await BookService.update(req.params.idlibro, req.body.author, req.body.title);
            if (!theBook) {
                res.status(404);
                res.send("Libro non trovato");
                return;
            }
            res.json(theBook);
        } else {
            res.status(400);
            res.send("Bas Request: Devi specificare l'ID ("+req.params.idlibro+") del libro il nuovo titolo ("+req.body.title+") e l'autore ("+req.body.author+")");
        }

    };

    static async deleteBook(req, res) {
        if (req.params && req.params.idlibro) {
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

}

module.exports = BookController;