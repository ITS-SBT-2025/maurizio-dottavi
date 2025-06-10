console.log("Ecco il mio script.js");

function queryBooks (){
    console.log("Addesso faccio la query");
    let titolo= document.getElementById("titolo").value;
    let autore= document.getElementById("autore").value;
    console.log("Titolo: " + titolo);
    console.log("Autore: " + autore);
    let url = "/books?autore=" + encodeURIComponent(autore) + "&titolo=" + encodeURIComponent(titolo);
    fetch(url, {
        headers: {"Accept": "application/json"}
    }).then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dati ricevuti:", data);
            let resultDiv = document.getElementById("result");
            resultDiv.innerHTML = ""; // Pulisce il contenuto precedente
            if (data.length === 0) {
                resultDiv.innerHTML = "<p>Nessun libro trovato.</p>";
            } else {
                data.forEach(book => {
                    let bookDiv = document.createElement("div");
                    bookDiv.textContent = `Autore: ${book.author}, Titolo: ${book.title}`;
                    resultDiv.appendChild(bookDiv);
                });
            }
        })
        .catch(error => {
            console.error("Errore durante la fetch:", error);
        });
 console.log("Termine Funzione") ;      
}

