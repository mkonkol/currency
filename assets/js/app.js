import { API, DIV_CURRENCY, LIST, LIST_NAME, CURRENCY_NAME, REMOVE_ALL, INFO_EMPTY, REFRESH_DATA } from "./variables.js";
import { saveToLocalStorage, removeToLocalStorage, getLocalStorage } from "./localStorage.js";
import { createFlags, addToList } from "./createElements.js";
import { activateDragNDrop } from "./dragDrop.js";

let currencyRates = [];
let elementList = null;

/**
 * Connects to the API
 * @param {string} url
 */
const fetchData = async url => {
    const response = await fetch(`${url}`);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();
}

export const getDate = () => new Date().getTime();

/**
 * Checks how much time has passed since the last update
 * @param {number} date
 */
export const timeDifference = date => {
    let currentDate = getDate();
    let difference = currentDate - date;

    if (difference >= (6 * 60 * 60 * 1000)) {
        return true
    }
    return false;
}

/**
 * Saves the date in a different format
 * @param {number} timestamp 
 */
export const formatDate = timestamp => {
    let date = new Date(timestamp);

    let day = (`0${date.getDate()}`).slice(-2);
    let month = (`0${(date.getMonth() + 1)}`).slice(-2);
    let year = date.getFullYear();

    let hour = (`0${date.getHours()}`).slice(-2);
    let minutes = (`0${date.getMinutes()}`).slice(-2);

    let ymd = [day, month, year].join('-');
    let hm = [hour, minutes].join(':')
    
    return `${ymd} ${hm}`;
}

/**
 * Sets the last retrieved data to a global variable
 * @param {*} data 
 */
export const setLastData = data => currencyRates.push(data);

/**
 * Saves received data in local storage, creates dynamically HTML with the data
 */
export const currencyData = () => {
    fetchData(`${API}`)
        .then( response => {
            let items = response[0].rates;
            currencyRates = [];
            createFlags(items);
            saveToLocalStorage(currencyRates, CURRENCY_NAME);
            checkAndDisabledCurrency();
        })
        .catch( error => console.log(error.message));
}

/**
 * Checks and updates the list and sets "disabled" class for the given currencies
 */
export const checkAndDisabledCurrency = () => {
    if (LIST.children.length > 0) {
        INFO_EMPTY.classList.add('hidden');
        const CHILDREN = [...LIST.children];

        CHILDREN.map(item => {
            const LI = document.getElementById(item.id);
            const PURCHASE = LI.getElementsByClassName('item__details--purchase')[0];
            const SALE = LI.getElementsByClassName('item__details--sale')[0];
            const ID = item.id.replace('favourite-', '');

                if (currencyRates.length > 0) {
                    currencyRates.filter(currency => {
                        if (currency.code === ID) {
                            PURCHASE.textContent = currency.bid.toFixed(4);
                            SALE.textContent = currency.ask.toFixed(4);
                        }
                    });
                }
            (document.getElementById(ID)) && document.getElementById(ID).classList.add('disabled');
        });
    }
}

const isEmptyFavoritesList = () => (LIST.firstChild === null) && INFO_EMPTY.classList.remove('hidden');

/**
 * Removes a single item from the list 
 * when you select a currency that already exists in the favorites
 * @param {*} e 
 */
export function deleteElement (e) {
    const ITEM = e.target;
    const FIELD = ITEM.parentElement.parentElement;
    FIELD.remove();

    const CODE = FIELD.id.replace('favourite-', '');
    const FLAG = document.getElementById(CODE);
    FLAG.classList.remove('disabled');
    isEmptyFavoritesList();
    removeToLocalStorage(CODE, LIST_NAME);
}

/**
 * Delete a single item from the list with the button
 * @param {string} code 
 */
const removeFromFavourites = code => {
    const CHILDREN = [...LIST.children];
    CHILDREN.filter(item => { 
        (item.id === `favourite-${code}`) && item.remove();
    });
    elementList = document.querySelectorAll('.favourite-list__item');
}

/**
 * Removes all items from the list
 */
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
    INFO_EMPTY.classList.remove('hidden');
}

/**
 * After selecting a given currency - adds or removes it from the list
 * @param {*} e 
 */
function selectedFlag (e) {
    const ITEM = e.target;
    const FIELD = ITEM.parentElement;

    if (!FIELD.classList.contains('currency__field')) return;

    currencyRates
        .filter(item => item.code === FIELD.id)
        .map(currency => {
            if (!FIELD.classList.contains('disabled')) {
                FIELD.classList.add('disabled');
                INFO_EMPTY.classList.add('hidden');
                addToList(currency);
                saveToLocalStorage(currency, LIST_NAME);
            } else {
                FIELD.classList.remove('disabled');
                removeFromFavourites(currency.code);
                removeToLocalStorage(currency.code, LIST_NAME);
                isEmptyFavoritesList();
            }
            elementList = document.querySelectorAll('.favourite-list__item');
            activateDragNDrop(elementList);
        });
}

// EventListeners
DIV_CURRENCY.addEventListener('click', selectedFlag);
REMOVE_ALL.addEventListener('click', removeAll);
REFRESH_DATA.addEventListener('click', currencyData);

// init()
getLocalStorage(CURRENCY_NAME);
getLocalStorage(LIST_NAME);

if (LIST.children.length > 0) {
    elementList = document.querySelectorAll('.favourite-list__item');
    activateDragNDrop(elementList);
}