

const test = q('#test');

const init = () => {
    const allProducts = false;
    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => allProducts = json);

    a('keydown',e => {
        if(allProducts) {
            for(let i = 0; i < 10; ++i) {
                const
            }
        }
    })
}

document.addEventListener('DOMContentLoaded',init);

function s(...message) {
    for(el of message){
        console.log(el)
    };
};

function a(event,cb,target = document) {
    return target.addEventListener(event,cb);
}

function q(selector,all = false) {
    if(all) return document.querySelectorAll(selector);
    else return document.querySelector(selector);
}

function buildElement(type,classes = [],id = undefined) {
    const returnElement = document.createElement(type);
    for(el of classes) {
        returnElement.classList.add(el);
    }
    returnElement.id = id;
    return returnElement;
}

// Random # of products feature