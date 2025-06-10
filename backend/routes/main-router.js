// Importa il controller dei libri
const BooksController = require('../controllers/BookController');

// Definisce tutte le rotte dell'applicazione
function routes(app) {
    // Rotta principale: messaggio di benvenuto
    app.get('/', function (req, res) {
        res.send('Hello to my Library');
    });

    // Middleware di test per loggare le richieste
    function test (req, res, next) {
        console.log("Test middleware");
        next();
    }
    // Rotta per cercare libri (GET /books)
    app.get('/books', BooksController.searchBooks);
    // Rotta per creare un nuovo libro (POST /books)
    app.post('/books',BooksController.createBook);
    // Rotta per ottenere un libro tramite id, con middleware di test (GET /books/:idlibro)
    app.get('/books/:idlibro', test, BooksController.getBook);
    // Rotta per aggiornare un libro tramite id (POST /books/:idlibro)
    app.post('/books/:idlibro', BooksController.updateBook);
    // Rotta per cancellare un libro tramite id (DELETE /books/:idlibro)
    app.delete('/books/:idlibro', BooksController.deleteBook);

}

// Esporta la funzione per l'utilizzo nell'app principale
module.exports = routes;