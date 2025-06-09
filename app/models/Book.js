
const fs = require('fs').promises;
const path = require('path');

const config = require('config');
const storageType = config.get('storage');
/**
 * Book Model
 * 
 * This model handles the loading, saving, creating, and finding of books.
 * It uses a file-based storage system to persist book data.
 * 
 * @class Book
 */
class Book {
    static async load() {
        const data = { content: [], maxid: 0 };
        if (storageType == 'file') {
            let DataFile= config.get('DataFile');
            try {
                let content = await fs.readFile(path.join(__dirname, DataFile), 'utf8');
                console.log(content.toString());
                content.toString().split("\n").forEach((line) => {
                    const [idx, title, author] = line.split(";");
                    if (idx) {
                        console.log(`idx: ${idx}, Nome: ${title}, Autore: ${author}`);
                        data.content.push({ idx, title, author });
                        if (parseInt(idx) > data.maxid) {
                            data.maxid = parseInt(idx);
                        }
                    }
                });

            } catch (err) {
                console.error(err);
            }

        } else {
            // Storage di tipo database ... da implementare...
            console.error("Lettura non implementato per il tipo di storage:", storageType);
        }
        console.log("Caricamento completato:", data);
        return data;
    }

    static async save(data) {
        if (storageType == 'file') {
            let DataFile= config.get('DataFile');
            try {
                let content = "";
                data.content.forEach((item) => {
                    content += `${item.idx};${item.title};${item.author}\n`;
                })
                await fs.writeFile(path.join(__dirname, DataFile), content, 'utf8');
                console.log("Salvataggio completato:", content);
            } catch (err) {
                console.error(err);
            }
        } else {
            // Salvataggio su database ... da implementare...
            console.error("Salvataggio non implementato per il tipo di storage:", storageType);
        }
    }

    static async create(a, t) {
        try {
            const data = await Book.load();
            data.maxid++;
            let theBook = { idx: data.maxid, title: t, author: a };
            data.content.push(theBook);
            await Book.save(data);
            return theBook;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

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
            console.error(err);
        }
        return result;
    }

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
            console.error(err);
            result = null;
        }
        return result;
    }


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
            console.error(err);
            return false;
        }
        return true;
    }

    static async find(author = null, title = null) {
        let result = [];
        try {
            const data = await Book.load();
            let a = author ? author.toLowerCase() : null;
            let t = title ? title.toLowerCase() : null;
            data.content.forEach((item) => {
                if ((!a && !t) || (a && item.author.toLowerCase().includes(a)) || (t && item.title.toLowerCase().includes(t))) {
                    result.push(item);
                }
            });
        } catch (err) {
            console.error(err);
        }
        return result;
    }

}


module.exports = Book;

