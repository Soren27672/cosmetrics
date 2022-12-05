
let allProducts = false;
let atId1 = false;

const init = () => {
    const test = q('#test');
    const loader = q('#loader');
    const displayArea = q('#displayArea');
    const filterButton = q('#filterButton');
    const brandFilter = q('#brandFilter');
    const typeFilter = q('#typeFilter');
    const tagsDiv = q('#tagsDiv');
    const categoryFilter = q('#categoryFilter');
    const filters = [];

    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => {
        allProducts = json;

        // CREATE DROPDOWNS FROM RESPONSE
        
        const brands = createArrayOfValuesStoredInKey(allProducts,'brand');
        populateDropdown(brandFilter,brands[1]);

        const types = createArrayOfValuesStoredInKey(allProducts,'product_type');
        populateDropdown(typeFilter,types[1]);

        const categories = createArrayOfValuesStoredInKey(allProducts,'category');
        populateDropdown(categoryFilter,categories[1]); 

        const tags = createArrayOfValuesStoredInKey(allProducts,'tag_list');
        for(const tag in tags[0]) {
            s(tags,tags[0],tag,tags[0][tag]);
            const box = buildElement('input',false,[false],tags[0].tag);
            box.type = 'checkbox';
            box.name = 'tags';
            box.value = tags[0].tag;

            const label = buildElement('label',tags[1][tag]);
            label.for = tags[0].tag;
            
            tagsDiv.appendChild(box);
            tagsDiv.appendChild(label);
            tagsDiv.appendChild(buildElement('br'));
        }

    });

    

    // LOAD RANDOM PRODUCT
    ael('click',e => displayArea.appendChild(buildCell(5)),random);

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
    if(id) returnElement.id = id;
    if(text) returnElement.textContent = text;
    return returnElement;
}

function buildCell(n) {
    const cell = buildElement('div',undefined,['prodCell',n]);

    const img = buildElement('img',['prodImg',n]);
    img.src = `https:${allProducts[n].api_featured_image}`;
    cell.appendChild(img);

    const name = buildElement('p',allProducts[n]['name'],['prodName',n]);
    cell.appendChild(name);

    const brand = buildElement('a',`by ${allProducts[n].brand}`,['prodBrand',n]);
    brand.href = allProducts[n].website_link;
    cell.appendChild(brand);

    let formattedPrice = allProducts[n].price;
    switch (formattedPrice.length) {
        case 1:
            formattedPrice += '.00';
            break;
        case 3:
            formattedPrice += '0';
            break;
    }
    
    const price = buildElement('p',`${allProducts[n].price_sign}${formattedPrice}`,['prodPrice',n]);
    cell.appendChild(price);

    return cell;
}

function returnFiltered() {
    const returnProducts = [...allProducts.filter(filters[0])];
    for(let i = 1; i < filters.length; ++i) {
        returnProducts = [...returnProducts.filter(filters[i])];
    }
    return returnProducts;
}

function populateDropdown(dropdown,array) {
    for(index in array) {
        const option = buildElement('option',array[index]);
        option.value = array[index].replace(' ','_');
        dropdown.appendChild(option);
    }
}

function createArrayOfValuesStoredInKey(obj,key) {
    let values = {};

        for(const pair in obj) {
            if(Array.isArray(obj[pair][key])) {
                s('ran')
                for(el of obj[pair][key]) {
                    values[el] = true;
                }
            }
            else values[obj[pair][key]] = true;
        }

        const returnArray = [];

        returnArray[0] = [...Object.keys(values)].sort();
        returnArray[1] = returnArray[0].map(cv => cv.replace('_',' '));
        returnArray[0] = returnArray[1].map(cv => cv.replace(' ','_'))
    return returnArray;
}

// Random # of products feature

// Just have loading sign

// Upon clicking randomize, a dom element with some product info is created

// Super Filter function that's passed an array of filter function callbacks
// *For each* function in Super filter function, modify returnProducts
// Then generate first 10

/*  take a dropdown element
    add option for each item meant to be in dropdown
    need: array of all items ^^
    how get?

    api doesn't provide list of brands within api
    gonna have to iterate thru each product and store brand in an object
    then Object.keys(brands)
    then run that thru the dropdownpopulator


    Dropdown Populator:
    for each element of provided array, add <option>
    element into provided element
    set .value to provided value

*/