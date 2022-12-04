
let allProducts = false;
let atId1 = false;

const init = () => {
    const test = q('#test');
    const loader = q('#loader');
    const displayArea = q('#displayArea');
    const random = q('#random');

    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => allProducts = json);

    // TEST ALLPRODUCTS
    ael('keydown',e => {
        if(allProducts) {
            test.textContent = '';
            for(let i = 0; i < 10; ++i) {
                test.appendChild(buildElement('li',allProducts[i].name));
            }
        }
    })

    // LOAD RANDOM PRODUCT
    ael('click',e => {

        const cell = buildElement('div',undefined,['productCell']);

        const img = buildElement('img');
        img.src = `https:${allProducts[8].api_featured_image}`;
        cell.appendChild(img);

        displayArea.appendChild(cell);

    },random)

    // LOADING DIALOG
    // (Color changing)
    let counter = 0;
    const loadingIv = setInterval(() => {
        loader.style.color = `rgb(${(0.5*Math.sin(++counter/2)+0.5)*255},${(0.5*Math.sin(counter/2)+0.5)*255},${(0.5*Math.sin(counter/2)+0.5)*255})`;
        if (allProducts) {
            clearInterval(loadingIv);
            loader.style.display = 'none';
        };
    },50)
}

document.addEventListener('DOMContentLoaded',init);

function s(...message) {
    for(el of message){
        console.log(el)
    };
};

function ael(event,cb,target = document) {
    return target.addEventListener(event,cb);
}

function q(selector,all = false) {
    if(all) return document.querySelectorAll(selector);
    else return document.querySelector(selector);
}

function buildElement(type,text = undefined,classes = [],id = undefined) {
    const returnElement = document.createElement(type);
    for(el of classes) {
        returnElement.classList.add(el);
    }
    returnElement.id = id;
    returnElement.textContent = text;
    return returnElement;
}

// Random # of products feature

// Just have loading sign

// Upon clicking randomize, a dom element with some product info is created