// Importa moduli per la gestione dei file e dei percorsi
const fs = require('fs').promises;
const path = require('path');

// Importa la configurazione dell'applicazione
const config = require('config');
const storageType = config.get('storage');

/**
 * User Model
 * 
 * Questo modello gestisce il caricamento, il salvataggio, la creazione, l'aggiornamento e la cancellazione degli utenti.
 * Utilizza un sistema di storage basato su file per la persistenza dei dati degli utenti.
 * 
 * @class User
 */
class User {
    // Carica tutti i libri dal file di storage o da database (da implementare)
    static async load() {
        const data = { content: [], maxid: 0 };
        if (storageType == 'file') {
            let DataFile= config.get('UserDataFile');
            try {
                // Legge il file dei dati e popola l'array dei libri
                let content = await fs.readFile(path.join(__dirname, DataFile), 'utf8');
                //console.log(content.toString());
                content.toString().split("\n").forEach((line) => {
                    const [idx, username, name, lastname, email, hash, salt] = line.split("\t");
                    if (idx) {
                        //console.log(`idx: ${idx}, Username: ${username}, Email: ${email}`);
                        data.content.push({ idx, username, name, lastname, email, hash, salt});
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

    // Salva tutti gli utenti nel file di storage o su database (da implementare)
    static async save(data) {
        if (storageType == 'file') {
            let DataFile= config.get('UserDataFile');
            try {
                // Serializza i dati dei libri in formato testo
                let content = "";
                data.content.forEach((item) => {
                    content += `${item.idx}\t${item.username}\t${item.name}\t${item.lastname}\t${item.email}\t${item.hash}\t${item.salt}\n`;
                })
                await fs.writeFile(path.join(__dirname, DataFile), content, 'utf8');
                //console.log("Salvataggio completato:", content);
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

    // Crea un nuovo utente e lo aggiunge allo storage
    static async create(username, name, lastname, email, hash, salt) {
        try {
            const data = await User.load();
            data.maxid++;
            let theUser = { idx: data.maxid, username, name, lastname, email, hash, salt };
            data.content.push(theUser);
            await User.save(data);
            return theUser;
        } catch (err) {
            // Gestione errori di creazione libro
            console.error(err);
            return null;
        }
    }

    // Restituisce un utente dato il suo id
    static async get(idx) {
        let result = null;
        try {
            const data = await User.load();
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

    // Aggiorna i dati di un utente esistente dato l'id, 
    static async replace(idx, username, name, lastname, email, hash, salt) {
        let result = null;
        try {
            const data = await User.load();
            data.content.forEach((item) => {
                if (item.idx === idx) {
                    item.username = username;
                    item.name = name;
                    item.lastname = lastname;
                    item.email = email;
                    item.hash = salt;
                    item.salt = salt;
                    result = item;
                }
            });
            await User.save(data);
        } catch (err) {
            // Gestione errori di aggiornamento libro
            console.error(err);
            result = null;
        }
        return result;
    }

    // Cancella un utente dato l'id
    static async delete(idx) {
        let result = { content: [], maxid: 0 };
        try {
            const data = await User.load();
            data.content.forEach((item) => {
                console.log(`Controllo: ${item.idx} != ${idx}`);
                if (item.idx != idx) {
                    result.content.push(item);
                }
            });
            await User.save(result);
        } catch (err) {
            // Gestione errori di cancellazione libro
            console.error(err);
            return false;
        }
        return true;
    }

    // Cerca libri filtrando per autore e/o titolo (se specificati)
    static async find(username = null) {
        let result = null;
        try {
            const data = await User.load();
            data.content.forEach((item) => {
                // Se non ci sono filtri, restituisce tutti i libri
                // Altrimenti filtra per autore o titolo (case insensitive)
                if ((username) && (username == item.username)) {
                    result=item;
                }
            });
        } catch (err) {
            // Gestione errori di ricerca libro
            console.error(err);
        }
        return result;
    }

}

// Esporta il modello User per l'utilizzo nei servizi
module.exports = User;

