import { CURRENCY_NAME } from "./variables.js";
import { addToList, createFlags } from "./createElements.js";
import { currencyData, getDate, timeDifference, checkAndDisabledCurrency } from "./app.js";

function checkDataLocalStorage(name) {
    let items = null;
    items = (localStorage.getItem(name) === null) ? [] : JSON.parse(localStorage.getItem(name));
    return items;
}

export const saveToLocalStorage = (data, name) => {
    let items = checkDataLocalStorage(name);

    if (items.length > 1 && name === CURRENCY_NAME) {
        items = [];
    }

    items.push(data);
    if (name === CURRENCY_NAME) {
        items.push(getDate());
    }
    localStorage.setItem(name, JSON.stringify(items));
}

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

export const getLocalStorage = name => {
    let items = checkDataLocalStorage(name);

    if (name === CURRENCY_NAME) {
        if (items.length === 0) {
            currencyData();
            return;
        } else {
            const TIME = timeDifference(items[1]);
            (TIME) 
                ? currencyData()
                : createFlags(items[0]);
        }
    } else {
        items.map(item => addToList(item));
        checkAndDisabledCurrency();
    }
}