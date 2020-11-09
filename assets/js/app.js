// Variables
const API = 'http://api.nbp.pl/api/exchangerates/tables';
const TABLE = 'C';

// Na dzień dzisiejszy, może zwrócić Brak danych
// const TODAY = `${API}/${TABLE}/today`;

// Aktualnie obowiązujący kurs waluty CODE
// `http://api.nbp.pl/api/exchangerates/rates/${TABLE}/${CODE}`;

// Na dzień dzisiejszy, może zwrócić Brak danych
// `http://api.nbp.pl/api/exchangerates/rates/${TABLE}/${CODE}/today`;

const fetchData = async url => {
    const response = await fetch(`${url}`);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();
}

fetchData(`${API}/${TABLE}`)
    .then( response => console.log(response))
    .catch( error => console.log(error.message));