import { DIV_CURRENCY, LIST } from "./variables.js";
import { setLastData, deleteElement } from "./app.js";

/**
 * Creates an HTML element
 * @param {object} param 
 */
export const createTagElement = ({ type, id, className, message, onClick, source, draggable }) => {
    const ITEM = document.createElement(type);

    if (id) ITEM.id = id;
    if (className) ITEM.className = className;
    if (message) ITEM.innerText = message;
    if (onClick) ITEM.onclick = onClick;
    if (source) ITEM.src = source;
    if (draggable) ITEM.setAttribute("draggable", true);

    return ITEM;
}

/**
 * Dynamically creates currencies on the site
 * @param {array, object} items 
 */
export const createFlags = items => {
    items.map( item => {
        let code = item.code,
            disabled = item.class;
            
        if (code === 'XDR') return false;
        setLastData(item);

        if (!document.getElementById(code)) {
            let additionClass = (disabled) ? disabled : '';
    
            const DIV = createTagElement({
                type: 'div',
                id: code,
                className: `currency__field ${additionClass}`
            });
    
            const IMG = createTagElement({
                type: 'img',
                className: 'currency__field__image',
                source: `./assets/images/${code}.png`
            });
            
            const P = createTagElement({
                type: 'p',
                message: code
            });
            
            DIV.appendChild(IMG);
            DIV.appendChild(P);
            DIV_CURRENCY.appendChild(DIV);
        }
    });
}

/**
 * Adds items to the favorites list
 * @param {object} item 
 */
export const addToList = item => {
    if (item.length <= 0 ) return;

    const LIST_LENGTH = LIST.children.length;
    let i = (LIST_LENGTH > 0) ? (LIST_LENGTH + 1) : 1;

    const LI = createTagElement({
        type: 'li',
        id: `favourite-${item.code}`,
        className: `favourite-list__item`,
        draggable: true
    });

    const DIV = createTagElement({
        type: 'div',
        className: 'item__details'
    });

    const P1 = createTagElement({
        type: 'p',
        className: 'item__details--fullname',
        message: item.currency
    });

    const P2 = createTagElement({
        type: 'p',
        className: 'item__details--code',
        message: item.code
    });

    const P3 = createTagElement({
        type: 'p',
        className: 'item__details--purchase',
        message: item.bid.toFixed(4)
    });

    const P4 = createTagElement({
        type: 'p',
        className: 'item__details--sale',
        message: item.ask.toFixed(4)
    });

    DIV.appendChild(P1);
    DIV.appendChild(P2);
    DIV.appendChild(P3);
    DIV.appendChild(P4); 

    const BUTTON = createTagElement({
        type: 'button',
        className: 'button button--trash',
        onClick: deleteElement,
        message: 'Remove'
    });

    DIV.appendChild(BUTTON);
    LI.appendChild(DIV);
    LIST.appendChild(LI);
}