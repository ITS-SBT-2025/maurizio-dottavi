const BooksController = require('../controllers/BookController');

function routes(app) {
    app.get('/', function (req, res) {
        res.send('Hello to my Library');
    });

    function test (req, res, next) {
        console.log("Test middleware");
        next();
    }
    app.get('/books', BooksController.searchBooks);
    app.post('/books',BooksController.createBook);
    app.get('/books/:idlibro', test, BooksController.getBook);
    app.post('/books/:idlibro', BooksController.updateBook);
    app.delete('/books/:idlibro', BooksController.deleteBook);

}

module.exports = routes;