
const Book = require('../models/Book');

class BookService {
    static async getBookById(idlibro) {
        return await Book.get(idlibro);
    }
    static async search(autore=null, titolo=null) {
        return await Book.find(autore, titolo);
    }

    static async create(autore, titolo) {
        return await Book.create(autore, titolo);
    }

    static async update(idx, autore, titolo) {
        return await Book.replace(idx,autore, titolo);
    }

    static async delete(idx) {
        return await Book.delete(idx);
    }

}

module.exports = BookService;