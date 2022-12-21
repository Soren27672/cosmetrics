
let allProducts = false;
let atId1 = false;
let signs = [];
const demoProd = {
    brand: 'Enigma',
    image_link: '//www.sephora.com/productimages/sku/s1925965-av-15-zoom.jpg?imwidth=315',
    decription: 'Finally, a lip gloss that will never fade. Go ahead, wear it to bed, we love a challenge.<BR>Shine above all the rest with permagloss, by Enigma.',
    product_type: 'lip_gloss',
    tag_list: ['vegan free','glossless','no pig'],
    website_link: 'https://google.com',
    price: '60.85',
    price_sign: null,
    name: 'Permagloss by Enigma',
    category: 'lip_gloss',
    product_colors: [{
        hex_value: '#abcdef',
        name: 'alphabeta'
    }, {
        hex_value: '#00000f',
        name: 'midnight'
    }, {
        hex_value: '#0f0f0f',
        name: 'groy'
    }, {
        hex_value: '#13fa00',
        name: 'elation'
    }, {
        hex_value: '#fa6601',
        name: 'fruitful'
    }, {
        hex_value: '#e11fee',
        name: 'elite'
    }, {
        hex_value: '#777765',
        name: 'numeric'
    }, {
        hex_value: '#fa1e5f',
        name: 'limestone'
    }]
}

const init = () => {
    

    const loader = q('#loader');
    
    const logInForm = q('#logInForm');
    const greeting = q('#greeting');

    let refreshRate = 50;
    
    
    /// INTERACTS
    const brandFilter = q('#brandFilter');
    const typeFilter = q('#typeFilter');
    const categoryFilter = q('#categoryFilter');
    const openUser = q('#openUser');
    const logOut = q('#logOut');
    const allAny = q('#allAny');
    const logIn = q('#logIn');
    logIn.classList.add('inactive');
    const register = q('#register');
    register.classList.add('inactive');
    const filterButton = q('#filterButton');
    const openTags = q('#openTags');

    /// DIVS
    const userDiv = q('#userDiv');
    const logInDiv = q('#logInDiv');
    let userOpenST = false;
    const userOptionsDiv = q('#userOptionsDiv');
    const tagsDiv = q('#tagsDiv');
    const displayArea = q('#displayArea');
    const topBarDiv = q('#topBarDiv');
    const highlight = q('#highlight');

    /// P ELEMENTS
    const avg = q('#avg');
    const min = q('#min');
    const max = q('#max');


    const allAnyBinarium = {
        'all': 'any',
        'any': 'all'
    }
    let filteredProducts = [];
    let checkedTags = [];
    let user = null;

    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => {
        allProducts = json;
        for(let i = 0; i < allProducts.length; ++i) {
            allProducts[i].index = i;
            }

        // CREATE DROPDOWNS FROM RESPONSE
        
        const brands = createArrayOfValuesStoredInKey(allProducts,'brand');
        populateDropdown(brandFilter,brands);

        const types = createArrayOfValuesStoredInKey(allProducts,'product_type');
        populateDropdown(typeFilter,types);

        const categories = createArrayOfValuesStoredInKey(allProducts,'category');
        populateDropdown(categoryFilter,categories); 

        signs = allProducts.filter(cv => {
            if ((cv.price_sign === null) && (cv.price !== null)) return true;
        });

        const tags = createArrayOfValuesStoredInKey(allProducts,'tag_list');
        for(const tag in tags) {
            const box = buildElement('input',false,[],tags[tag].scored);
            box.type = 'checkbox';
            box.name = 'tags';
            box.value = tags[tag].scored;

            const label = buildElement('label',capitalizeFirsts(tags[tag].spaced));
            label.setAttribute('for',`${tags[tag].scored}`);
            
            tagsDiv.appendChild(box);
            tagsDiv.appendChild(label);
            tagsDiv.appendChild(buildElement('br'));
        }

        for(let i = 0; i < 12; ++i) {
            displayArea.appendChild(buildCell(allProducts[i],i));
        };

        // DRY UP
        ael('click',e => {
            filteredProducts = [...allProducts];
            if (brandFilter.value !== "brand") filteredProducts = filteredProducts.filter(cv => cv.brand === brands[brandFilter.value].spaced);
            if (typeFilter.value !== "type") filteredProducts = filteredProducts.filter(cv => cv.product_type === types[typeFilter.value].scored);
            if (categoryFilter.value !== "category") filteredProducts = filteredProducts.filter(cv => cv.category === categories[categoryFilter.value].scored);

            checkedTags = [...tagsDiv.children].filter(cv => cv.checked === true).map(cv => cv.value);


            // ANYALL FUNCTIONALITY
            if (allAny.textContent === "all") {
                for(const tag of checkedTags) {
                    filteredProducts = filteredProducts.filter(cv => cv.tag_list.includes(tag.replace('_',' ')));
                };
            } else if (checkedTags.length !== 0) {
                filteredProducts = filteredProducts.filter(cv => {
                    for(const tag of checkedTags) {
                        if (cv.tag_list.includes(tag.replace('_',' '))) return true;
                    }
                    return false;
                });
            };

            const prices = [];
            let maxPrice = {
                value: 0
            };
            let minPrice = {
                value: 1000000
            };
            let skips = 0;

            for(const index in filteredProducts) {

                if (filteredProducts[index].price === null) continue;

                const prodPrice = parseInt(filteredProducts[index].price);

                if (prodPrice === 0) continue;

                prices.push(prodPrice);

                switch (true) {
                    case prodPrice > maxPrice.value:
                        maxPrice.ids = [];
                        maxPrice.ids.push(index);
                        maxPrice.value = prodPrice;
                        break;
                    case prodPrice === maxPrice.value:
                        maxPrice.ids.push(index);
                        break;
                    case prodPrice < minPrice.value:
                        minPrice.ids = [];
                        minPrice.ids.push(index);
                        minPrice.value = prodPrice;
                        break;
                    case prodPrice === minPrice.value:
                        minPrice.ids.push(index);
                        break;
                }
            }

            if(prices.length) {
                avg.textContent = `$${roundToPlace((prices.reduce((ac,cv) => ac+cv) / (prices.length - skips)),0.01)}`;
                min.textContent = `$${minPrice.value}`;
                max.textContent = `$${maxPrice.value}`;

            } else avg.textContent = 'No Data!'

            displayArea.innerHTML = '';

            for(let i = 0; i < filteredProducts.length; ++i) {
                displayArea.appendChild(buildCell(filteredProducts[i],i));
            };

            if (filteredProducts.length !== 1) sendTopBar(`Found ${filteredProducts.length} results!`); else sendTopBar(`Found ${filteredProducts.length} result!`)
            
        },filterButton);
    });

    /* for(let i = 0; i < 12; ++i) {
        displayArea.appendChild(buildCell(demoProd,0));
    } */

    /// SHOW TAGS DIV
    ael('click',e => {
        e.preventDefault();
        tagsDiv.style.display = tagsDiv.style.display === '' ? 'block' : '';
        openTags.textContent = openTags.textContent === 'Show Tags' ? 'Hide Tags' : 'Show Tags';
    },openTags)

    /// SETUP LOGGING IN
    ael('click',e => {
        e.preventDefault();
        if (logIn.classList.contains('inactive')) return;
        let ok;
        let status;
        fetch(`http://localhost:3000/users/${encodeURI(logInForm.username.value)}`)
        .then(res => {
            ok = res.ok;
            status = res.status;
            return res.json();
        })
        .then(json => {
            if (!ok) {
                if (status === 404) {
                    sendTopBar(`Our records show no account registered under ${logInForm.username.value}`)
                } else sendTopBar('Unexpected Error, try again');
            } else if ((json.password === logInForm.password.value)) {
                user = json.id;
                logInForm.username.value = '';
                logInForm.password.value = '';
                logIn.classList.add('inactive');
                register.classList.add('inactive');
                greeting.textContent = `Hello, ${user}!`
                logInDiv.style.display = 'none';
                userOptionsDiv.style.display = 'block';
                sendTopBar(`Welcome back, ${user}!`);
            } else if (json.password !== logInForm.password.value) sendTopBar('Incorrect password'); else sendTopBar('Unexpected Error, try again');
        })
        .catch(reason => {
            s(reason.message);
            switch (reason.message) {
                case 'Failed to fetch':
                    sendTopBar('Could not access database');
                break;
                default:
                    sendTopBar(reason.message);
            }
        });
    },logIn)

    /// REGISTERING NEW ACCOUNT
    ael('click',e => {
        e.preventDefault();
        if (register.classList.contains('inactive')) return;
        fetch(`http://localhost:3000/users/${encodeURI(logInForm.username.value)}`)
        .then(res => {
            if (res.status === 404) {
                fetch(`http://localhost:3000/users`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        id: logInForm.username.value,
                        password: logInForm.password.value
                    })
                })
                .then(res => res.json())
                .then(json => {
                    user = json.id;
                    logInForm.username.value = '';
                    logInForm.password.value = '';
                    logIn.classList.add('inactive');
                    register.classList.add('inactive');
                    greeting.textContent = `Hello, ${user}!`
                    sendTopBar(`Registration Success! Welcome to Cosmetrics, ${user}!`);
                });
                } else if (res.ok) alert(`The account ${logInForm.username.value} is already taken.`)
            });
    },register)

    /// DEACTIVATE LOGIN/REGI BUTTONS WHEN FIELDS ARE EMPTY
    ael('keydown',e => {
        setTimeout(() => {
            if ((logInForm.password.value === '') || (logInForm.username.value === '')) {
                logIn.classList.add('inactive');
                register.classList.add('inactive');
            } else {
                logIn.classList.remove('inactive');
                register.classList.remove('inactive');
            }
        },1)

    })

    /// LOGGING OUT
    ael('click',e => {
        e.preventDefault();
        logOutUser();
    },logOut)

    /// CLOSING USER DIV
    ael('click', e => {
        e.preventDefault();
        if (!userOpenST) {
            userDiv.style.display = 'block';
        } else if (userOpenST) {
            userDiv.style.display = 'none';
        }
        userOpenST = !userOpenST;
    },openUser)

    // LOADING DIALOG
    // (Color changing)
    let counter = 0;
    const loadingIv = setInterval(() => {
        loader.style.color = `rgb(${(0.5*Math.sin(++counter/2)+0.5)*255},${(0.5*Math.sin(counter/2)+0.5)*255},${(0.5*Math.sin(counter/2)+0.5)*255})`;
        if (allProducts) {
            clearInterval(loadingIv);
            loader.style.display = 'none';
            document.querySelectorAll('.default').forEach(cv => cv.textContent = 'select');
        };
    },refreshRate);

    // SET UP ALL/ANY SWAPPER
    ael('click',e => {
        allAny.textContent = allAny.textContent === 'all' ? 'any' : 'all';
    },allAny)

    ael('keydown',e => {
        if(e.key === 'k') sendTopBar('Funcionale!',1,3,50);
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
    if(id) returnElement.id = id;
    if(text) returnElement.textContent = text;
    return returnElement;
}

function buildCell(product,id) {
    const cell = buildElement('div',null,['prodCell',`${id}`]);

    const img = buildElement('img',null,['prodImg',`${id}`]);
    img.src = `https://${product.api_featured_image}`;
    cell.appendChild(img);

    const name = buildElement('p',product.name.replaceAll('<BR>',' '),['prodName',`${id}`]);
    cell.appendChild(name);

    const brand = buildElement('a',`by ${product.brand}`,['prodBrand',`${id}`]);
    brand.href = product.website_link;
    cell.appendChild(brand);

    const priceDiv = buildElement('div','',['priceDiv',`${id}`])

    const currency = buildElement('p','',['prodCurrency',`${id}`]);
    
    let formattedPrice = parseFloat(product.price);
    if ((product.price === null) || (product.price === '0.0')) {
        formattedPrice = "Price unlisted, visit the merchant's website"
        

    }
    else {
        // Price formatting
        if (formattedPrice === Math.floor(formattedPrice)) formattedPrice += '.00';
        else if (formattedPrice * 10 === Math.floor(formattedPrice * 10)) formattedPrice += '0';

        // Currency formatting
        if (product.price_sign === null) {
            currency.textContent = '$';
            currency.classList.add('none');

            const div = buildElement('div',undefined,['popOutDiv',`${id}`])
            currency.appendChild(div)
            const message = buildElement('p',"No currency was provided for this product, visit the merchant's website for more information",['popOutText',`${id}`])
            div.appendChild(message);

        } else currency.textContent = product.price_sign;
        priceDiv.appendChild(currency);
    }
    
    const price = buildElement('p',`${formattedPrice}`,['prodPrice',`${id}`]);

    priceDiv.appendChild(price);
    cell.appendChild(priceDiv);

    const colorsDiv = buildElement('div',null,['colorsDiv',`${id}`]);

    let i = 0;

    for(;i < 6; ++i) {
        if (product.product_colors[i]) {
            colorsDiv.appendChild(buildColorBox(product.product_colors[i],id));
        } else break;
    }

    colorsDiv.style.gridTemplateColumns = `repeat(${i}, max-content)`;
    cell.appendChild(colorsDiv);
    if (product.product_colors.length > 6) {
        const more = buildElement('p','More colors');

        const moreColorsDiv = buildElement('div',null,['popOutDiv','moreColorsDiv',`${id}`]);

        const amtOfMoreColors = product.product_colors.length
        
        moreColorsDiv.style.gridTemplateColumns = `repeat(${Math.min(amtOfMoreColors - 6,3)},max-content)`;
        moreColorsDiv.style.left = `${89.25 - (8.5*(Math.min(amtOfMoreColors - 6,3)) + 5*(Math.min(amtOfMoreColors - 6,3) - 1))}px`

        for(let i = 6; i < product.product_colors.length; ++i) {
            moreColorsDiv.appendChild(buildColorBox(product.product_colors[i],id));
        }

        more.appendChild(moreColorsDiv);
        cell.appendChild(more);
    }

    return cell;
}

function populateDropdown(dropdown,array) {
    for(let i = 0; i < array.length; ++i) {
        if ((array[i].spaced !== 'null') && (array[i].spaced !== '')) {
            const option = buildElement('option',capitalizeFirsts(array[i].spaced));
            option.value = i;
            dropdown.appendChild(option);
        }
    }
}

function createArrayOfValuesStoredInKey(arr,key) {
    const values = {};

        for(const pair in arr) {
            if(Array.isArray(arr[pair][key])) {
                for(const el of arr[pair][key]) {
                    values[el] = true;
                    }
                }
            else if (arr[pair][key]) {
                values[arr[pair][key]] = true
            }
        }
    
        return (Object.keys(values)).map(cv => {
            return {
                scored: cv.replace(' ','_'),
                spaced: cv.replace('_',' ')
            }
        })
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

function capitalizeFirsts(string) {
    const returnString = [];
    let capsNext = true;
    for(let i = 0; i < string.length; ++i) {
        if (capsNext) {
            returnString.push(string[i].toUpperCase());
            capsNext = false;
        } else returnString.push(string[i]);
        if (string[i] === ' ') capsNext = true;
        };
    return returnString.join('');
}

function logOutUser() {
    user = null;
    logInDiv.style.display = 'block';
    userOptionsDiv.style.display = 'none';
    greeting.innerHTML = `No user currently signed in<br>Sign in below!`;
    sendTopBar('Logged out!');
}

function logInUser(user) {

}

function sendTopBar(message,easeSec = 1,duration = 3,refresh = 50) {
    const topBar = buildElement('div',null,['topBarDiv']);
    topBar.style.display = 'block';
    topBar.style.top = '-76px';
    topBarDiv.appendChild(topBar);
    
    const p = buildElement('p',message,['topBarMessage']);
    topBar.appendChild(p);

    const easeIn = createGeometricSeq(76,easeSec,refresh);

    moveAlongArray(easeIn,topBar,'top',0,true);
    setTimeout(() => {
        moveAlongArray(easeIn,topBar,'top',0);
        setTimeout(() => topBar.remove(),(easeIn.length * refresh));

    },(easeIn.length * refresh) + (duration * 1000));

}

function createGeometricSeq(span,seconds,refresh = 50) {
    const steps = (seconds * 1000) / refresh;
    const returnArray = [];
    const multiplier = (span + 1) ** (1/steps);
    for(let i = 0; i <= steps; ++i) {
        returnArray.push((multiplier ** i) - 1)
    }
    return returnArray;
}

function moveAlongArray(array,element,property,subtractFrom = null,reverse = false) {
    element.style[property] = `${produceFinal(array,0,subtractFrom,reverse)}px`;
    let i = 1;
    const IV = setInterval(() => {
        if (i < array.length) {
            element.style[property] = `${produceFinal(array,i,subtractFrom,reverse)}px`;
            ++i;
        }

        if (i === array.length) clearInterval(IV);
    },50)
}


function produceFinal(array,i,subSubtractFrom,subReverse) {
    let final = subReverse ? array[array.length - i] : array[i];
    if (typeof subSubtractFrom === 'number') final = subSubtractFrom - final;
    return final;
}

function buildColorBox(colorObject,id) {
    const box = buildElement('div',null,['colorBox',`${id}`]);
    box.style.backgroundColor = `${colorObject.hex_value}`;

    ael('click',e => {
        highlight.textContent = '';

        const color = buildElement('div',null,['color',`${id}`]);
        color.style.backgroundColor = colorObject.hex_value;
        highlight.appendChild(color);

        const name = buildElement('p',capitalizeFirsts(colorObject.colour_name),['colorName',`${id}`]);
        highlight.appendChild(name);

        const hex = buildElement('p',colorObject.hex_value,['colorHex',`${id}`]);
        highlight.appendChild(hex);

        const showProducts = buildElement('button','Show Products with this Color',['showProductsByColor']);

        highlight.style.display = 'block';
        //ael()
        highlight.appendChild(showProducts);

    },box)

    return box;
}

function roundToPlace(number,place) {
    const multiplier = place / (place ** 2);
    return Math.round(number * multiplier) / multiplier;
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