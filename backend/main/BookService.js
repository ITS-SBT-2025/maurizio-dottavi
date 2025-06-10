// Importa il modello Book per interagire con i dati dei libri
const Book = require('../models/Book');

class BookService {
    // Restituisce un libro dato il suo id
    static async getBookById(idlibro) {
        return await Book.get(idlibro);
    }
    // Cerca libri filtrando per autore e/o titolo (se specificati)
    static async search(autore=null, titolo=null) {
        return await Book.find(autore, titolo);
    }

    // Crea un nuovo libro con autore e titolo
    static async create(autore, titolo) {
        return await Book.create(autore, titolo);
    }

    // Aggiorna un libro esistente dato l'id, autore e titolo
    static async update(idx, autore, titolo) {
        return await Book.replace(idx,autore, titolo);
    }

    // Cancella un libro dato l'id
    static async delete(idx) {
        return await Book.delete(idx);
    }

}

// Esporta il servizio per l'utilizzo nei controller
module.exports = BookService;