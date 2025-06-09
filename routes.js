
const books = require('./books');

function setRoutes(app) {
    app.get('/', function (req, res) {
        res.send('Hello World')
    });

    app.get('/books/:autore', books.cercaLibri);
    app.get('/books/:idlibro', books.getLibro);
    app.get('/books/ciao', books.ciao);
    app.get('/books/:idlibro', books.getLibro2);
    app.post('/books',books.creaLibro);

    app.get('/books', books.getBooks);

}
function __setRoutes_v124(app) {
    app.get('/', function (req, res) {
        res.send('Hello World')
    });

    app.get('/books/:autore', books.cercaLibri);
    app.get('/books/:idlibro', books.getLibro);
    app.get('/books/ciao', books.ciao);
    app.get('/books/:idlibro', books.getLibro2);
    app.post('/books',books.creaLibro);

    app.get('/books', books.getBooks);

}

exports.init = setRoutes;

