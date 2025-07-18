
const fs = require('fs').promises;
const path = require('path');


function ciao (req, res) {
        res.send('Quest è Ciao');
}

function cercaLibri(req, res) {
    let autore = req.params.autore;
    let titolo = req.query.titolo;

    if (req.params.autore) {
        autore = req.query.autore;
    }

    let parametri_di_ricerca = [];

    let dbquery = "select name,author from books";
    if (autore) {
        parametri_di_ricerca.push("author like '%" + autore + "%'");
    }
    if (titolo) {
        parametri_di_ricerca.push("title like '%" + titolo + "%'");
    }

    let queryfinale = dbquery;
    if (parametri_di_ricerca.length > 0) {
        queryfinale += " WHERE ";
        queryfinale += parametri_di_ricerca.join(" AND ");
    }

    res.send('Ecco la lista dei libri per la ricerca:' + queryfinale);
}
function getLibro(req, res) {
    if (req.params.idlibro) {
        res.send("Nome libro trovato:" + req.params.idlibro);
    } else {
        res.status(404);
        res.send("libro NON trovato");
    }
}
function getLibro2(req, res) {
    res.send("Qui non passo mai");
}

function BooksSync(a,t) {
    const data = [];
    try {
        let content = fs.readFileSync(path.join(__dirname, 'data/books.dat'), 'utf8');
        console.log(content);
        content.split("\n").forEach((line) => {
            const [title, author] = line.split(";");
            if (title && author) {
                console.log(`Nome: ${title}, Autore: ${author}`);
                data.push({ title, author });
            }
        });

    } catch (err) {
        console.error(err);
    }
    return data;
}
async function getBooks(req, res) {
    let autore = req.query.autore;
    let titolo = req.query.titolo;
    let data = await BooksAwait(autore,titolo );
    console.log("=======================");
    console.log(data);
    console.log("=======================");
    res.json(data);
}
function BooksAsync(a,t) {
    const data = [];
    try {
         fs.readFile(path.join(__dirname, 'data/books.dat'), (err, content) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(content);
            /*content.split("\n").forEach((line) => {
            const [title, author] = line.split(";");
            if (title && author) {
                console.log(`Nome: ${title}, Autore: ${author}`);
                data.push({ title, author });
            }
                */
       
            console.log("ABBIAMO LETTO IL FILE");
        });
        console.log("DOPO LA LETTURA");


    } catch (err) {
        console.error(err);
    }
    return data;
}



async function BooksAwait(a,t) {
    const data = [];
    try {
        let content = await fs.readFile(path.join(__dirname, 'data/books.dat'), 'utf8');
        console.log(content.toString());
        content.toString().split("\n").forEach((line) => {
            const [title, author] = line.split(";");
            if (title && author) {
                console.log(`Nome: ${title}, Autore: ${author}`);
                data.push({ title, author });
            }
        });

    } catch (err) {
        console.error(err);
    }
    return data;
}
async function creaLibro (req, res) {
    console.log("Ho ricevuto una richiesta di creazione libro:" , req.body);
    if (!req.body || !req.body.autore || !req.body.titolo) {
        res.status(400).send("Errore: Devi specificare autore e titolo del libro");
        return;
    }
    let a = req.body.autore;
    let t = req.body.titolo;
    const data = await BooksAwait();
    data.push({ title: t, author: a });
    SaveBooks(data);

    res.send('Ho creato il tuo libro: ' + t + " scritto da " + req.body.autore);
}
async function SaveBooks(data) {
    try {
        let content = "";
        data.forEach( (item) => {
            content += `${item.title};${item.author}\n`;
        })
        await fs.writeFile(path.join(__dirname, 'data/books.dat'), content, 'utf8');

    } catch (err) {
        console.error(err);
    }
}

exports.cercaLibri = cercaLibri;
exports.BooksSync = BooksSync;
exports.BooksAsync = BooksAsync;
exports.BooksAwait = BooksAwait;
exports.getLibro2 = getLibro2;
exports.getLibro = getLibro;
exports.ciao = ciao;
exports.SaveBooks = SaveBooks;
exports.creaLibro = creaLibro;
exports.getBooks = getBooks;
exports.BooksAwait = BooksAwait;
