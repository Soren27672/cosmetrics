
let allProducts = false;
let atId1 = false;

const init = () => {
    const loader = q('#loader');
    const displayArea = q('#displayArea');
    const filterButton = q('#filterButton');
    const brandFilter = q('#brandFilter');
    const typeFilter = q('#typeFilter');
    const tagsDiv = q('#tagsDiv');
    const categoryFilter = q('#categoryFilter');
    let filteredProducts = [];

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

        for(let i = 0; i < 10; ++i) {
            displayArea.appendChild(buildCell(allProducts[i],i));
        };

        ael('click',e => {
            filteredProducts = [...allProducts];
            if (brandFilter.value !== "brand") filteredProducts = filteredProducts.filter(cv => cv.brand === (brandFilter.value).replace('_',' '));
            if (typeFilter.value !== "type") filteredProducts = filteredProducts.filter(cv => cv.product_type === (typeFilter.value).replace('_',' '));
            if (categoryFilter.value !== "category") filteredProducts = filteredProducts.filter(cv => cv.category === (categoryFilter.value).replace('_',' '));

            displayArea.innerHTML = '';

            for(let i = 0; i < filteredProducts.length; ++i) {
                displayArea.appendChild(buildCell(filteredProducts[i],i));
            };
            
        },filterButton);
    });



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

function buildCell(product,id) {
    const cell = buildElement('div',undefined,['prodCell',`${id}`]);

    const img = buildElement('img',['prodImg',`${id}`]);
    img.src = `https:${product.api_featured_image}`;
    cell.appendChild(img);

    const name = buildElement('p',product.name,['prodName',`${id}`]);
    cell.appendChild(name);

    const brand = buildElement('a',`by ${product.brand}`,['prodBrand',`${id}`]);
    brand.href = product.website_link;
    cell.appendChild(brand);

    let formattedPrice = parseFloat(product.price);
    if (formattedPrice === Math.floor(formattedPrice)) formattedPrice += '.00';
    else if (formattedPrice * 10 === Math.floor(formattedPrice * 10)) formattedPrice += '0';
    
    const price = buildElement('p',`${product.price_sign}${formattedPrice}`,['prodPrice',`${id}`]);
    cell.appendChild(price);

    return cell;
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

function filterByKeyValue(array,key,value) {
    const indexes = [];
    for(const index in array) {
        if (Array.isArray(array[index][key])) {
            for(const el of subArray) {
                if (el === value) ids[index] = true;
            }
        } else if (array[index][key] === value) ids[index] = true;
    }

    return indexes;
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