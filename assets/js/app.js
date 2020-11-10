// Variables
const API = 'http://api.nbp.pl/api/exchangerates/tables/C';
const CURRENCY = document.getElementsByClassName('currency')[0];
const LIST = document.getElementsByClassName('favourite-list')[0];

let currencyRates = [];

// EventListeners
CURRENCY.addEventListener('click', selectedFlag);

const fetchData = async url => {
    const response = await fetch(`${url}`);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    return await response.json();
}

const getDate = () => new Date().getTime();

const timeDifference = (currentDate, date) => {
    let difference = currentDate - date;

    if (difference >= (6 * 60 * 60)) {
        refreshData();
    }
}

const getlastData = () => currencyRates;
const setLastData = data => currencyRates.push(data);

const currencyData = async () => {
    fetchData(`${API}`)
        .then( response => {
            let items = response[0].rates;
            currencyRates = [];

            items.map((item, idx) => {
                if (idx === (items.length - 1)) return false;
                setLastData(item);

                const DIV = createTagElement({
                    type: 'div',
                    id: item.code,
                    className: 'currency__field'
                });

                const IMG = createTagElement({
                    type: 'img',
                    className: 'currency__field__image',
                    source: `./assets/images/${item.code}.png`
                });
                
                const P = createTagElement({
                    type: 'p',
                    message: item.code
                });
                
                DIV.appendChild(IMG);
                DIV.appendChild(P);
                CURRENCY.appendChild(DIV);
            });
        })
        .catch( error => console.log(error.message));
}

const refreshData = async () => {
    await currencyData();
    // save to local storage    
}

currencyData();

const createTagElement = ({ type, id, className, message, onClick, source }) => {
    const ITEM = document.createElement(type);

    if (id) ITEM.id = id;
    if (className) ITEM.className = className;
    if (message) ITEM.innerText = message;
    if (onClick) ITEM.onclick = onClick;
    if (source) ITEM.src = source;

    return ITEM;
}

const addToList = data => {
    if (data.length <= 0 ) return;

    const LIST_LENGTH = LIST.children.length;
    let i = (LIST_LENGTH > 0) ? (LIST_LENGTH + 1) : 1;

    const LI = createTagElement({
        type: 'li',
        id: `favourite-${data[0].code}`,
        className: `favourite-list__item`
    });

    const DIV = createTagElement({
        type: 'div',
        className: 'item__details'
    });

    data.map(item => {
        const P1 = createTagElement({
            type: 'p',
            message: item.currency
        });

        const P2 = createTagElement({
            type: 'p',
            message: item.code
        });

        const P3 = createTagElement({
            type: 'p',
            message: item.bid.toFixed(2)
        });

        const P4 = createTagElement({
            type: 'p',
            message: item.ask.toFixed(2)
        });

        DIV.appendChild(P1);
        DIV.appendChild(P2);
        DIV.appendChild(P3);
        DIV.appendChild(P4); 
    });

    const BUTTON = createTagElement({
        type: 'button',
        className: 'button button--trash',
        onClick: deleteElement,
        message: 'Remove'
    });

    DIV.appendChild(BUTTON);
    LI.appendChild(DIV);
    LIST.appendChild(LI);

    // save to local storage
}

const deleteElement = e => {
    const item = e.target;
    const field = item.parentElement.parentElement;
    field.remove();
    const CODE = field.id.replace('favourite-', '');
    const FLAG = document.getElementById(CODE);
    FLAG.classList.remove('disabled');
}

const removeFromFavourites = code => {
    const CHILDREN = [...LIST.children];
    const CHILD = CHILDREN.filter(item => item.id === `favourite-${code}`);
    CHILD[0].remove();
}

function selectedFlag (e) {
    const item = e.target;
    const field = item.parentElement;

    if (!field.classList.contains('currency__field')) return;

    const chosenCurrency = currencyRates.filter(item => item.code === field.id);

    if (!field.classList.contains('disabled')) {
        field.classList.add('disabled');
        // add to list
        addToList(chosenCurrency);
    } else {
        field.classList.remove('disabled');
        // remove from list
        removeFromFavourites(chosenCurrency[0].code)
    }
}