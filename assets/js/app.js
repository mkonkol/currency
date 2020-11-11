import { API, DIV_CURRENCY, LIST, LIST_NAME, CURRENCY_NAME, REMOVE_ALL } from "./variables.js";
import { saveToLocalStorage, removeToLocalStorage, getLocalStorage } from "./localStorage.js";
import { createFlags, addToList } from "./createElements.js";

let currencyRates = [];

// EventListeners
DIV_CURRENCY.addEventListener('click', selectedFlag);
REMOVE_ALL.addEventListener('click', removeAll);

const fetchData = async url => {
    const response = await fetch(`${url}`);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();
}

export const getDate = () => new Date().getTime();

export const timeDifference = (date) => {
    let currentDate = getDate();
    let difference = currentDate - date;

    if (difference >= (6 * 60 * 60 * 1000)) {
        return true
    }
    return false;
}

// const getlastData = () => currencyRates;
export const setLastData = data => currencyRates.push(data);

export const currencyData = () => {
    fetchData(`${API}`)
        .then( response => {
            // console.log(response);
            let items = response[0].rates;
            currencyRates = [];
            createFlags(items);
            saveToLocalStorage(currencyRates, CURRENCY_NAME);
            checkAndDisabledCurrency();
        })
        .catch( error => console.log(error.message));
}

export const checkAndDisabledCurrency = () => {
    if (LIST.children.length > 0) {
        const CHILDREN = [...LIST.children];

        CHILDREN.map(item => {
            const LI = document.getElementById(item.id);
            const PURCHASE = LI.getElementsByClassName('item__details--purchase')[0];
            const SALE = LI.getElementsByClassName('item__details--sale')[0];
            const ID = item.id.replace('favourite-', '');

                if (currencyRates.length > 0) {
                    currencyRates.filter(currency => {
                        if (currency.code === ID) {
                            PURCHASE.textContent = currency.bid.toFixed(2);
                            SALE.textContent = currency.ask.toFixed(2);
                        }
                    });
                }
            (document.getElementById(ID)) && document.getElementById(ID).classList.add('disabled');
        });
    }
}

export function deleteElement (e) {
    const ITEM = e.target;
    const FIELD = ITEM.parentElement.parentElement;
    FIELD.remove();

    const CODE = FIELD.id.replace('favourite-', '');
    const FLAG = document.getElementById(CODE);
    FLAG.classList.remove('disabled');
    removeToLocalStorage(CODE, LIST_NAME);
}

const removeFromFavourites = code => {
    const CHILDREN = [...LIST.children];
    CHILDREN.filter(item => { 
        (item.id === `favourite-${code}`) && item.remove();
    });
}

function selectedFlag (e) {
    const ITEM = e.target;
    const FIELD = ITEM.parentElement;

    if (!FIELD.classList.contains('currency__field')) return;

    currencyRates
        .filter(item => item.code === FIELD.id)
        .map(currency => {
            if (!FIELD.classList.contains('disabled')) {
                FIELD.classList.add('disabled');
                addToList(currency);
                saveToLocalStorage(currency, LIST_NAME);
            } else {
                FIELD.classList.remove('disabled');
                removeFromFavourites(currency.code);
                removeToLocalStorage(currency.code, LIST_NAME);
            }
        });
}

function removeAll () {
    while (LIST.firstChild) {
        const CODE = LIST.firstChild.getElementsByClassName('item__details--code')[0].textContent;
        removeToLocalStorage(CODE, LIST_NAME);
        LIST.firstChild.remove();
    }
    const CHILDREN = [...DIV_CURRENCY.children];
    CHILDREN.map(item => {
        (item.classList.contains('disabled')) && item.classList.remove('disabled');
    });
}

getLocalStorage(CURRENCY_NAME);
getLocalStorage(LIST_NAME);