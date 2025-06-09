const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs').promises;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use("/", express.static(path.join(__dirname, "/public"), { "extensions": ["html"] }));

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(miomw);
function miomw(req, res, next) {
    console.log("Richiesta ricevuta: metodo="+req.method+" url=", req.url, );
    if (req.method != "POST" && req.method != "GET") {
        res.status(405);
        res.send("Metodo non supportato");
    }
    next();
}



app.get('/', miomw, function (req, res) {
    //console.log("Cookies:", req.cookies.__cf_bm);
    //console.log("Cookies:", req.cookies.__cfruid);
    console.log("Cookies authenticato:", req.cookies.authenticato);
    if (typeof(req.cookies.authenticato) === 'undefined') {
        res.cookie('authenticato', 'maurizio', { maxAge: 900000, httpOnly: true });
        console.log("Cookie authenticato impostato");
    }
    
    res.send('Hello World')
});


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


app.get('/booksuuu', function (req, res) {
    res.send('Ecco la lista dei libri')
});


function getLibro2(req, res) {
    res.send("Qui non passo mai");
}
function getLibro(req, res) {
    if (req.params.idlibro) {
        res.send("Nome libro trovato:" + req.params.idlibro);
    } else {
        res.status(404);
        res.send("libro NON trovato");
    }
}
app.get('/books/:autore', cercaLibri);
app.get('/books/:idlibro', getLibro);
app.get('/books/ciao', function (req, res) {
    res.send('Quest è Ciao');
});
app.get('/books/:idlibro', getLibro2);


app.post('/books', creaLibro);

app.get('/books', getBooks);

async function creaLibro (req, res) {
    if (!req.body.autore || !req.body.titolo) {
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

async function getBooks(req, res) {
    let autore = req.query.autore;
    let titolo = req.query.titolo;
    let data = await BooksAwait(autore,titolo );
    console.log("=======================");
    console.log(data);
    console.log("=======================");
    res.json(data);
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




app.listen(3000);