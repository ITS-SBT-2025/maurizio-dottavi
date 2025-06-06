const express = require('express')
const app = express();
const path=require('path');
const fs=require('fs');


app.use("/",express.static(path.join(__dirname,"/public"), {"extensions":["html"]}));
app.use(express.urlencoded());

app.get('/', function (req, res) {
  res.send('Hello World')
});


function cercaLibri  (req, res) {
    let autore=req.params.autore;
    let titolo=req.query.titolo;

    if (req.params.autore) {
        autore=req.query.autore;
    }
    
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
}

app.get('/books', cercaLibri);


app.get('/booksuuu', function (req, res) {
  res.send('Ecco la lista dei libri')
});


function getLibro2 (req,res){
   res.send("Qui non passo mai");
} 
function getLibro (req,res){
    if (req.params.idlibro) {
        res.send ("Nome libro trovato:" + req.params.idlibro);
    } else {
        res.status(404);
        res.send("libro NON trovato");
    }
}
app.get('/books/:autore',cercaLibri) ;
app.get('/books/:idlibro',getLibro) ;
app.get('/books/ciao', function (req, res) {
  res.send('Quest è Ciao');
});
app.get('/books/:idlibro',getLibro2) ;


app.post('/books', function (req, res) {
  let a=req.body.autore;
  let t=req.body.titolo;
  

  res.send('Ho creato il tuo libro: ' + t + " scritto da " + req.body.autore);
});


app.listen(3000);