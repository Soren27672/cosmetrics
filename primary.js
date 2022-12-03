
const init = () => {
    const test = q('#test');
    let allProducts = false;
    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => allProducts = json);

    ael('keydown',e => {
        if(allProducts) {
            test.textContent = '';
            for(let i = 0; i < 10; ++i) {
                test.appendChild(buildElement('li',allProducts[i].name));
            }
        } else window.alert('Loading');
    })
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