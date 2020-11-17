import { CURRENCY_NAME, LAST_DATE } from "./variables.js";
import { addToList, createFlags } from "./createElements.js";
import { currencyData, getDate, timeDifference, checkAndDisabledCurrency, formatDate } from "./app.js";

/**
 * Checks for local data
 * @param {string} name - key name
 */
function checkDataLocalStorage(name) {
    let items = null;
    items = (localStorage.getItem(name) === null) ? [] : JSON.parse(localStorage.getItem(name));
    return items;
}

/**
 * Saves data in local memory
 * @param {*} data
 * @param {string} name - key name
 */
export const saveToLocalStorage = (data, name) => {
    let items = checkDataLocalStorage(name);

    if (items.length > 1 && name === CURRENCY_NAME) items = [];

    items.push(data);
    if (name === CURRENCY_NAME) {
        const CURRENT_DATE = getDate();
        items.push(CURRENT_DATE);
        LAST_DATE.innerText = formatDate(CURRENT_DATE);
    }
    localStorage.setItem(name, JSON.stringify(items));
}

/**
 * Deletes the given item from local storage
 * @param {string} code - unique currency code
 * @param {string} name - key name
 */
export const removeToLocalStorage = (code, name) => {
    let items = checkDataLocalStorage(name);
    items.filter((item, idx) => {
        if (item.code === code) {
            items.splice(idx, 1);
            return false;
        }
    });
    localStorage.setItem(name, JSON.stringify(items));
}

/**
 * Retrieves data from local memory or from the server
 * @param {string} name - key name
 */
export const getLocalStorage = name => {
    let items = checkDataLocalStorage(name);

    if (name === CURRENCY_NAME) {
        if (items.length === 0) {
            currencyData();
            return;
        } else {
            const SAVE_TIME = items[1];
            const TIME = timeDifference(SAVE_TIME);
            (TIME) 
                ? currencyData()
                : createFlags(items[0]);
            LAST_DATE.innerText = formatDate(SAVE_TIME);
        }
    } else {
        items.map(item => addToList(item));
        checkAndDisabledCurrency();
    }
}

export const updateAfterChangePosition = (name, favorites) => {
    let items = checkDataLocalStorage(name);
    
    if (items.length > 0) {
        localStorage.removeItem(`${name}`);
    
        favorites.map(favourite => {
            let id = favourite.id.replace('favourite-', '');

            items.forEach(item => {
                if (item.code === id) {
                    saveToLocalStorage(item, name);
                }
            });
        });
    }
}