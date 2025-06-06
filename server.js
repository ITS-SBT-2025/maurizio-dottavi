const express = require('express')
const app = express()
app.get('/', function (req, res) {
  res.send('Hello World')
});
app.get('/books', function (req, res) {
    let autore=req.query.autore;
    let titolo=req.query.titolo;
    
    let parametri_di_ricerca=[];

    let dbquery = "select name,author from books";
    if (autore){
        parametri_di_ricerca.push("author like '%"+autore+"%'");
    }
    if (titolo){
         parametri_di_ricerca.push("title like '%"+titolo+"%'");
    }
    
    let queryfinale=dbquery ;
    if (parametri_di_ricerca.length >0) {
        queryfinale+= " WHERE ";
        queryfinale+= parametri_di_ricerca.join(" AND ");
    }
    
  res.send('Ecco la lista dei libri per la ricerca:' + queryfinale);
});
app.get('/booksuuu', function (req, res) {
  res.send('Ecco la lista dei libri')
});
app.post('/books', function (req, res) {
  res.send('Ho modificato il tuo libro')
});

app.listen(3000);