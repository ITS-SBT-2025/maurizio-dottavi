// Importa moduli per la gestione dei file e dei percorsi
const fs = require('fs').promises;
const path = require('path');

// Importa la configurazione dell'applicazione
const config = require('config');
const storageType = config.get('storage');

/**
 * Book Model
 * 
 * Questo modello gestisce il caricamento, il salvataggio, la creazione, la ricerca, l'aggiornamento e la cancellazione dei libri.
 * Utilizza un sistema di storage basato su file per la persistenza dei dati dei libri.
 * 
 * @class Book
 */
class Book {
    // Carica tutti i libri dal file di storage o da database (da implementare)
    static async load() {
        const data = { content: [], maxid: 0 };
        if (storageType == 'file') {
            let DataFile= config.get('DataFile');
            try {
                // Legge il file dei dati e popola l'array dei libri
                let content = await fs.readFile(path.join(__dirname, DataFile), 'utf8');
                console.log(content.toString());
                content.toString().split("\n").forEach((line) => {
                    const [idx, title, author] = line.split(";");
                    if (idx) {
                        console.log(`idx: ${idx}, Nome: ${title}, Autore: ${author}`);
                        data.content.push({ idx, title, author });
                        // Aggiorna il maxid se necessario
                        if (parseInt(idx) > data.maxid) {
                            data.maxid = parseInt(idx);
                        }
                    }
                });

            } catch (err) {
                // Gestione errori di lettura file
                console.error(err);
            }

        } else {
            // Storage di tipo database ... da implementare...
            // Qui andrebbe implementata la logica per il caricamento da database
            console.error("Lettura non implementato per il tipo di storage:", storageType);
        }
        console.log("Caricamento completato:", data);
        return data;
    }

    // Salva tutti i libri nel file di storage o su database (da implementare)
    static async save(data) {
        if (storageType == 'file') {
            let DataFile= config.get('DataFile');
            try {
                // Serializza i dati dei libri in formato testo
                let content = "";
                data.content.forEach((item) => {
                    content += `${item.idx};${item.title};${item.author}\n`;
                })
                await fs.writeFile(path.join(__dirname, DataFile), content, 'utf8');
                console.log("Salvataggio completato:", content);
            } catch (err) {
                // Gestione errori di scrittura file
                console.error(err);
            }
        } else {
            // Salvataggio su database ... da implementare...
            // Qui andrebbe implementata la logica per il salvataggio su database
            console.error("Salvataggio non implementato per il tipo di storage:", storageType);
        }
    }

    // Crea un nuovo libro e lo aggiunge allo storage
    static async create(a, t) {
        try {
            const data = await Book.load();
            data.maxid++;
            let theBook = { idx: data.maxid, title: t, author: a };
            data.content.push(theBook);
            await Book.save(data);
            return theBook;
        } catch (err) {
            // Gestione errori di creazione libro
            console.error(err);
            return null;
        }
    }

    // Restituisce un libro dato il suo id
    static async get(idx) {
        let result = null;
        try {
            const data = await Book.load();
            data.content.forEach((item) => {
                if (item.idx === idx) {
                    result = item;
                }
            });
        } catch (err) {
            // Gestione errori di lettura libro
            console.error(err);
        }
        return result;
    }

    // Aggiorna un libro esistente dato l'id, autore e titolo
    static async replace(idx, a, t) {
        let result = null;
        try {
            const data = await Book.load();
            let theBook = { idx: idx, title: t, author: a };
            data.content.forEach((item) => {
                if (item.idx === idx) {
                    item.author = a;
                    item.title = t;
                    result = item;
                }
            });
            await Book.save(data);
        } catch (err) {
            // Gestione errori di aggiornamento libro
            console.error(err);
            result = null;
        }
        return result;
    }

    // Cancella un libro dato l'id
    static async delete(idx) {
        let result = { content: [], maxid: 0 };
        try {
            const data = await Book.load();
            data.content.forEach((item) => {
                console.log(`Controllo: ${item.idx} != ${idx}`);
                if (item.idx != idx) {
                    result.content.push(item);
                }
            });
            await Book.save(result);
        } catch (err) {
            // Gestione errori di cancellazione libro
            console.error(err);
            return false;
        }
        return true;
    }

    // Cerca libri filtrando per autore e/o titolo (se specificati)
    static async find(author = null, title = null) {
        let result = [];
        try {
            const data = await Book.load();
            let a = author ? author.toLowerCase() : null;
            let t = title ? title.toLowerCase() : null;
            data.content.forEach((item) => {
                // Se non ci sono filtri, restituisce tutti i libri
                // Altrimenti filtra per autore o titolo (case insensitive)
                if ((!a && !t) || (a && item.author.toLowerCase().includes(a)) || (t && item.title.toLowerCase().includes(t))) {
                    result.push(item);
                }
            });
        } catch (err) {
            // Gestione errori di ricerca libro
            console.error(err);
        }
        return result;
    }

}

// Esporta il modello Book per l'utilizzo nei servizi
module.exports = Book;

