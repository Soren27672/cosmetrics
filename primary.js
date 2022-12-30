const css = false;

let user = null;
let favoriteProducts = {};
let allProducts = [];
let selectionMetrics = {};
const exchangeRates = {
    '$': 1,
    '£': 1.21,
    '€': 1.06,
    [null]: 1
}
const demoProd = {
    brand: 'Enigma',
    image_link: '//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/896/original/open-uri20171224-4-133ccrb?1514082674',
    description: 'Finally, a lip gloss that will never fade. Go ahead, wear it to bed, we love a challenge.<BR>Shine above all the rest with permagloss, by Enigma.',
    product_type: 'lip_gloss',
    tag_list: ['vegan free','glossless','no pig'],
    website_link: 'https://google.com',
    price: '60.85',
    price_sign: null,
    name: 'Permagloss by Enigma',
    category: 'lip_gloss',
    product_colors: [{
        hex_value: '#abcdef',
        colour_name: 'alphabeta'
    }, {
        hex_value: '#00000f',
        colour_name: 'midnight'
    }, {
        hex_value: '#0f0f0f',
        colour_name: 'groy'
    }, {
        hex_value: '#13fa00',
        colour_name: 'elation'
    }, {
        hex_value: '#f46601',
        colour_name: 'fruitful'
    }, {
        hex_value: '#e11fee',
        colour_name: 'elite'
    }, {
        hex_value: '#777765',
        colour_name: 'numeric'
    }, {
        hex_value: '#fa1e5f',
        colour_name: 'limestone'
    }, {
        hex_value: '#BF2C7E',
        colour_name:'heart on pencil'
    }]
}


const init = () => {
    

    const loader = q('#loader');
    
    const logInForm = q('#logInForm');
    const greeting = q('#greeting');

    let refreshRate = 50;
    
    
    /// INTERACTS
    const brandFilter = q('#brandFilter');
    const brandClear = q('#brandClear');
    const typeFilter = q('#typeFilter');
    const typeClear = q('#typeClear');
    const categoryFilter = q('#categoryFilter');
    const categoryClear = q('#categoryClear');
    const openUser = q('#openUser');
    const logOut = q('#logOut');
    const allAny = q('#allAny');
    const logIn = q('#logIn');
    logIn.classList.add('inactive');
    const register = q('#register');
    register.classList.add('inactive');
    const filterButton = q('#filterButton');
    const openFilters = q('#openFilters');
    const openSorts = q('#openSorts');
    const minButton = q('#minButton');
    const maxButton = q('#maxButton');
    const filterMin = q('#filterMin');
    const filterMax = q('#filterMax');

    /// DIVS
    const userDiv = q('#userDiv');
    const logInDiv = q('#logInDiv');
    let userOpenST = false;
    const userOptionsDiv = q('#userOptionsDiv');
    const tagsDiv = q('#tagsDiv');
    const filterDiv = q('#filterDiv');
    const sortDiv = q('#sortDiv');
    const displayArea = q('#displayArea');
    const topBarDiv = q('#topBarDiv');
    const highlight = q('#highlight');

     /// P ELEMENTS
    const selectionAvg = q('#slectionAvg');
    const selectionMin = q('#selectionMin');
    const selectionMax = q('#selectionMax');

    let filteredProducts = [];
    let checkedTags = [];

    if(!css) {
    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
    .then(res => res.json())
    .then(json => {
        allProducts = json;
        for(let i = 0; i < allProducts.length; ++i) {
            allProducts[i].index = i;
            allProducts[i].parsedPrice = (isNaN(parseFloat(allProducts[i].price))) || (parseFloat(allProducts[i].price) === 0) ? null : parseFloat(allProducts[i].price);
            }

        // CREATE DROPDOWNS FROM RESPONSE

        allProducts.push(demoProd);
        
        const filtrations = getFiltrations(allProducts,['brand','product_type','category','tag_list'],filterFormatter,true)

        populateDropdown(brandFilter,filtrations.brand.valuesRefined);

        populateDropdown(typeFilter,filtrations.product_type.valuesRefined);

        populateDropdown(categoryFilter,filtrations.category.valuesRefined); 

        for(const tag in filtrations.tag_list.valuesRefined) {
            const box = buildElement('input',false,[],tag);
            box.type = 'checkbox';
            box.name = 'tags';
            box.value = tag;

            const label = buildElement('label',filtrations.tag_list.valuesRefined[tag]);
            label.setAttribute('for',tag);
            
            tagsDiv.appendChild(box);
            tagsDiv.appendChild(label);
            tagsDiv.appendChild(buildElement('br'));
        }

        fillDisplay(allProducts.slice(0,12));

        // DRY UP
        ael('click',e => {
            filteredProducts = [...allProducts];
            if (brandFilter.value !== "brand") filteredProducts = filteredProducts.filter(cv => cv.brand === filtrations.brand.valuesRaw[brandFilter.value]);
            if (typeFilter.value !== "type") filteredProducts = filteredProducts.filter(cv => cv.product_type === filtrations.product_type.valuesRaw[typeFilter.value]);
            if (categoryFilter.value !== "category") filteredProducts = filteredProducts.filter(cv => cv.category === filtrations.category.valuesRaw[categoryFilter.value]);

            const filterMinValue = parseFloat(filterMin.value);
            if (!isNaN(filterMinValue)) {
                filteredProducts = filteredProducts.filter(cv => {
                    if (cv.parsedPrice === null) return false;
                    if (cv.parsedPrice >= filterMinValue) return true;
                    return false;
                });
            };

            const filterMaxValue = parseFloat(filterMax.value);
            if (!isNaN(filterMaxValue)) {
                filteredProducts = filteredProducts.filter(cv => {
                    if (cv.parsedPrice === null) return false;
                    if (cv.parsedPrice <= filterMaxValue) return true;
                    return false;
                });
            };

            checkedTags = [...tagsDiv.children]
            .filter(cv => cv.checked === true)
            .map(cv => cv.value);


            // ANYALL FUNCTIONALITY
            if (allAny.textContent === "all") {
                for(const tag of checkedTags) {
                    filteredProducts = filteredProducts.filter(cv => cv.tag_list.includes(filtrations.tag_list.valuesRaw[tag]));
                };
            } else if (checkedTags.length !== 0) {
                filteredProducts = filteredProducts.filter(cv => {
                    for(const tag of checkedTags) {
                        if (cv.tag_list.includes(filtrations.tag_list.valuesRaw[tag])) return true;
                    };
                    return false;
                });
            };

            const sort = [...q('[type=radio]',true)].find(cv => cv.checked === true);

            if(sort) {
                switch (sort.value) {
                    case 'lowPriceSort':
                        filteredProducts.sort((a,b) => a.parsedPrice - b.parsedPrice);
                        break;
                    case 'highPriceSort':
                        filteredProducts.sort((a,b) => b.parsedPrice - a.parsedPrice);
                        break;
                    case 'alphaSort':
                        filteredProducts.sort((a,b) => {
                            const aName = clearTags(a.name).toUpperCase();
                            const bName = clearTags(b.name).toUpperCase();
                            if (aName < bName) return -1;
                            if (aName > bName) return 1;
                            if (aName === bName) return 0;
                        });
                        break;
                    case 'revAlphaSort':
                        filteredProducts.sort((a,b) => {
                            const aName = clearTags(a.name).toUpperCase();
                            const bName = clearTags(b.name).toUpperCase();
                            if (aName > bName) return -1;
                            if (aName < bName) return 1;
                            if (aName === bName) return 0;
                        });
                        break;
                    case 'alphaBrandSort':
                        filteredProducts.sort((a,b) => {
                            const aBrand = clearTags(a.brand).toUpperCase();
                            const bBrand = clearTags(b.brand).toUpperCase();
                            if (aBrand < bBrand) return -1;
                            if (aBrand > bBrand) return 1;
                            if (aBrand === bBrand) return 0;
                        });
                        break;
                    case 'revAlphaBrandSort':
                        filteredProducts.sort((a,b) => {
                            const aBrand = clearTags(a.brand).toUpperCase();
                            const bBrand = clearTags(b.brand).toUpperCase();
                            if (aBrand > bBrand) return -1;
                            if (aBrand < bBrand) return 1;
                            if (aBrand === bBrand) return 0;
                        });
                        break;
                    default:
                        break;
                }
            }

            fillDisplay(filteredProducts);
            
        },filterButton);
    });
    } else {

    /// CHECK WITHOUT FETCHING
    for(let i = 0; i < 12; ++i) {
        displayArea.appendChild(buildCell(demoProd,0));
    }
    for (let i = 0; i < 12; ++i) {
        allProducts.push(demoProd);
    }
    }

    /// IMPLEMENT SHOW BUTTONS
    implementShowButton(openFilters,filterDiv,'Show Filters','Close Filters');
    implementShowButton(openSorts,sortDiv,'Show Sorts','Close Sorts');

    /// IMPLEMENT CLEAR SELECTED FILTER BUTTON
    for(const pair of [[brandFilter,brandClear],[typeFilter,typeClear],[categoryFilter,categoryClear]]) {
        s(pair)
        pair[1].addEventListener('click', e => {
            e.preventDefault();
            pair[0].selectedIndex = 0;
        })
    }

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
                logInUser(json.id);
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

    /// SHOW MIN AND MAX BUTTONS
    ael('click',e => {
        e.preventDefault();
        const childrenArray = [...displayArea.children];
        if (minButton.textContent === 'Show') {
            for(const cell of childrenArray) {
                for(const id of selectionMetrics.min.ids) {
                    if (cell.classList[1] === id) {
                        cell.style.display = 'block';
                        break;
                    }
                    cell.style.display = 'none';
                };
            };
            maxButton.textContent = 'Show';
        } else {
            for (const cell of childrenArray) {
                cell.style.display = 'block';
            };
        };
        minButton.textContent = minButton.textContent === 'Show' ? 'Back' : 'Show';
    },minButton)

    ael('click',e => {
        e.preventDefault();
        const childrenArray = [...displayArea.children];
        if (maxButton.textContent === 'Show') {
            for(const cell of childrenArray) {
                for(const id of selectionMetrics.max.ids) {
                    if (cell.classList[1] === id) {
                        cell.style.display = 'block';
                        break;
                    }
                    cell.style.display = 'none';
                };
            };
            minButton.textContent = 'Show';
        } else {
            for (const cell of childrenArray) {
                cell.style.display = 'block';
            };
        };
        maxButton.textContent = maxButton.textContent === 'Show' ? 'Back' : 'Show';
    },maxButton)
}

document.addEventListener('DOMContentLoaded',init);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS//BELOW///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    const cell = buildElement('div',null,['prodCell',`${id}`,product.id]);

    const img = buildElement('img',null,['prodImg',`${id}`]);
    img.src = `https://${product.api_featured_image}`;
    cell.appendChild(img);

    const name = buildElement('p',clearTags(product.name),['prodName',`${id}`]);
    cell.appendChild(name);

    const brandText = product.brand ? `by ${capitalizeFirsts(product.brand)}` : 'No Brand Provided';
    const brand = buildElement('a',brandText,['prodBrand',`${id}`]);
    brand.href = product.website_link;
    cell.appendChild(brand);

    /// PRICE
    /// Create div for price
    const priceDiv = buildElement('div','',['priceDiv',`${id}`]);

    /// Prepare variable for price display
    let formattedPrice;
    /// Check to see if a price is listed
    if ((product.price === null) || (product.price === '0.0')) {
        formattedPrice = "Price unlisted, visit the merchant's website";
    } else {
        /// If a price is listed, create currency element and prepare for
        /// price formatting
        formattedPrice = formatPrice(product.parsedPrice * exchangeRates[product.price_sign]);
        const currency = buildElement('p','',['prodCurrency',`${id}`]);

        if (product.price_sign === null) {
            /// Create "No currency provided" popup
            currency.textContent = '$';
            currency.classList.add('none');
    
            const div = buildElement('div',undefined,['popOutDiv',`${id}`])
            currency.appendChild(div)
            const message = buildElement('p',"No currency was provided for this product, visit the merchant's website for more information",['popOutText',`${id}`])
            div.appendChild(message);
    
        } else currency.textContent = '$';
        priceDiv.appendChild(currency);
    }
    
    const price = buildElement('p',`${formattedPrice}`,['prodPrice',`${id}`]);

    priceDiv.appendChild(price);
    cell.appendChild(priceDiv);

    /// COLORS
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

    const buttonsDiv = buildElement('div',null,['buttonsDiv',id]);

    /// J2FAVORITE
    const favoriteButton = buildElement('button','Favorite',['favoriteButton'],product.id);
    if (!user) favoriteButton.classList.add('inactive');
    
    ael('click',e => {
        e.preventDefault();
        if (favoriteButton.classList.contains('inactive')) return;
        if (favoriteButton.textContent === 'Favorite') {
	        favoriteProducts[favoriteButton.id] = true;
	        fetch(`http://localhost:3000/users/${encodeURI(user)}`,{
	            method: 'PATCH',
	            headers: {
	                "Content-Type": "application/json",
	                "Accept": "application/json",
	            },
	            body: JSON.stringify({
	                favorites: favoriteProducts
	            })
	        })
	        .then(res => res.json())
	        .then(json => {
	            s(json);
                updateFavorite(cell);
	            sendTopBar('Added to favorites!');
	        });
        }

        if (favoriteButton.textContent === 'Unfavorite') {
            delete favoriteProducts[favoriteButton.id];
            fetch(`http://localhost:3000/users/${encodeURI(user)}`,{
	            method: 'PATCH',
	            headers: {
	                "Content-Type": "application/json",
	                "Accept": "application/json",
	            },
	            body: JSON.stringify({
	                favorites: favoriteProducts
	            })
	        })
	        .then(res => res.json())
	        .then(json => {
	            s(json);
                updateFavorite(cell,false);
	            sendTopBar('Removed from favorites!');
	        });
        }
    },favoriteButton)
    buttonsDiv.appendChild(favoriteButton);

    /// COMPARE
    const compareButton = buildElement('button','Compare',['compareButton',id]);

    ael('click',e => {
        highlight.textContent = '';

        highlight.appendChild(img.cloneNode(true));
        highlight.appendChild(name.cloneNode(true));
        highlight.appendChild(brand.cloneNode(true))
        highlight.appendChild(priceDiv.cloneNode(true));
        highlight.appendChild(buildElement('p',clearTags(product.description),['prodDescription']));

        /// Determine metrics and phrasing

        buildComparisonDiv(product.parsedPrice,selectionMetrics,'this selection',highlight);
        if(product.product_type !== null) {
            buildComparisonDiv(product.parsedPrice,allProducts.filter(cv => cv.product_type === product.product_type).map(cv => cv.parsedPrice),`all ${filterFormatter(product.product_type)}s`,highlight);
        }
        if (product.brand !== null) {
            buildComparisonDiv(product.parsedPrice,allProducts.filter(cv => cv.brand === product.brand).map(cv => cv.parsedPrice),`all products by ${filterFormatter(product.brand)}`,highlight);
        }

        /// Build Clear button
        const clear = buildElement('button','Clear',['clear']);
        ael('click',e => {
            e.preventDefault();
            highlight.style.display = 'none';
        },clear)
        highlight.appendChild(clear);

        highlight.style.display = 'block';

    },compareButton)

    buttonsDiv.appendChild(compareButton);

    cell.appendChild(buttonsDiv);

    if (favoriteProducts[`${product.id}`] !== undefined) {
        s(`Passed from buildCell to updateFavorite: ${cell}`);
        updateFavorite(cell);
    }

    return cell;
}

function populateDropdown(dropdown,array) {
    for(let i = 0; i < array.length; ++i) {
        if ((array[i] !== 'null') && (array[i] !== '')) {
            const option = buildElement('option',array[i]);
            option.value = i;
            dropdown.appendChild(option);
        }
    }
}

/// REMOVE
function createArrayOfValuesStoredInKey(arr,key,alphabetize = true) {
    // The goal of this function is to take an array of objects and a key and then
    //     return an array of all unique values stored in that key within all the
    //     objects in the array
    const values = {};

        for(const pair in arr) {
            // Detect if value at arr[pair] is an array
            if(Array.isArray(arr[pair][key])) {
                // If so, then add each element of that array to `values` as a key
                for(const el of arr[pair][key]) {
                    values[el] = true;
                    }
                }
            else if (arr[pair][key]) {
                // If it's not an array, then just add it as is to `values` as a key
                values[arr[pair][key]] = true
            }
        }
    
        // Then, create an array that is just the keys of `values`
        //     (This way we have an array of all unique values stored in that key)

        if(alphabetize) {
            return ((Object.keys(values)).sort()).map(cv => {
            return {
                scored: cv.replace(' ','_'),
                spaced: cv.replace('_',' ')
            }
            
        });
    } else {
        return (Object.keys(values)).map(cv => {
        return {
            scored: cv.replace(' ','_'),
            spaced: cv.replace('_',' ')
        }});
    }
}

/// REMOVE
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
    for (const button of [...q('.favoriteButton',true)]) {
        button.classList.add('inactive');
    }
    for (const cell of [...q('.prodCell',true)]) {
        updateFavorite(cell);
    }
    favoriteProducts = {};
    sendTopBar('Logged out!');
}

function logInUser(username) {
    user = username;
    fetch(`http://localhost:3000/users/${encodeURI(user)}`)
    .then(res => res.json())
    .then(json => {
        if (json.favorites) favoriteProducts = json.favorites;
        for (const button of [...q('.favoriteButton',true)]) {
            button.classList.remove('inactive');
        }
        for (const cell of [...q('.prodCell',true)]) {
            // Both the class and the key are strings, so they eval to equal
            if (favoriteProducts[cell.classList[2]] !== undefined) {
                updateFavorite(cell);
            }
        }
    })
    
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
        // Clear Previous
        highlight.textContent = '';

        // Build color details (Swatch, name, hex value)
        const color = buildElement('div',null,['color',`${id}`]);
        color.style.backgroundColor = colorObject.hex_value;
        highlight.appendChild(color);

        const nameFormatted = colorObject.colour_name == null ? 'No Color Name' : colorObject.colour_name;
        const nameEl = buildElement('p',capitalizeFirsts(nameFormatted),['colorName',`${id}`]);
        highlight.appendChild(nameEl);

        const hex = buildElement('p',colorObject.hex_value,['colorHex',`${id}`]);
        highlight.appendChild(hex);

        // Show products with this color
        const showProducts = buildElement('button','Show Products with this Color',['showProductsByColor',colorObject.hex_value]);
        ael('click',e => {
            e.preventDefault();
            filteredProducts = [];
            
            filteredProducts = allProducts.filter(cv => {
                for(const color of cv.product_colors) {
                    if (color.hex_value === e.target.classList[1]) return true;
                }
                return false;
            });

            fillDisplay(filteredProducts);

        },showProducts)
        highlight.appendChild(showProducts);

        // Build Clear Button
        const clear = buildElement('button','Clear',['clear']);
        ael('click',e => {
            e.preventDefault();
            highlight.style.display = 'none';
        },clear)
        highlight.appendChild(clear);

        // Display
        highlight.style.display = 'block';

    },box)

    return box;
}

function roundToPlace(number,place = 0.01) {
    const multiplier = place ** -1;
    return Math.round(number * multiplier) / multiplier;
}

function fillDisplay(array) {

    /// Create Array
    const prices = array.map(cv => cv.parsedPrice);
    
    /// Generate metrics with array
    selectionMetrics = findMetrics(prices,[roundToPlace]);

    /// Update DOM with metrics
    if(selectionMetrics) {
        selectionAvg.textContent = `$${formatPrice(selectionMetrics.avg)}`;
        selectionMin.textContent = `$${formatPrice(selectionMetrics.min.value)}`;
        minButton.textContent = 'Show';
        selectionMax.textContent = `$${formatPrice(selectionMetrics.max.value)}`;
        maxButton.textContent = 'Show';

    } else for(const metric of [avg,min,max]) {
        metric.textContent = 'No Data!';
        };
    
    /// CLEAR DISPLAY AREA
    displayArea.innerHTML = '';

    /// FILL DISPLAY AREA
    for(let i = 0; i < array.length; ++i) {
        s(`Passed from fillDisplay to buildCell: ${i}`);
        displayArea.appendChild(buildCell(array[i],i));
    };
    
    /// SEND COMPLETION MESSAGE
    if (array.length !== 1) sendTopBar(`Found ${array.length} results!`); else sendTopBar(`Found ${array.length} result!`);
}

function formatPrice(float) {
    if (float === Math.floor(float)) return float += '.00';
    else if (float * 10 === Math.floor(float * 10)) return float += '0';
    else return roundToPlace(float,0.01);
}

function clearTags(string) {
    if (string === null) return '';
    let returnString = string.replaceAll(/(<([^>]+)>)/ig,' ');
    return returnString.replaceAll('\n','');
}

function implementShowButton(button,element,closedText,openText) {
    ael('click',e => {
        e.preventDefault();
        element.style.display = element.style.display === '' ? 'block' : '';
        button.textContent = button.textContent === closedText ? openText : closedText;
    },button)
}

function getFiltrations(objects,keysToSearch,formatter,alphabetize = false) {
    const returnObject = {};
    for (const objectKey in objects[0]) {
        if (!!keysToSearch.find(cv => cv === objectKey)) {
            const keyDataObject = {
                nameRaw: objectKey,
                nameRefined: formatter(objectKey),
                valuesRaw: [],
                valuesRefined: []
            };
            const values = {}
            for (const object of objects) {
                if (typeof object[objectKey] === 'string') {
                    values[object[objectKey]] = true;
                    continue;
                }
                if (Array.isArray(object[objectKey])) {
                    for (const element of object[objectKey]) {
                        values[element] = true;
                    }
                }
            }
            keyDataObject.valuesRaw = [...Object.keys(values)];
            if (alphabetize) keyDataObject.valuesRaw.sort();
            keyDataObject.valuesRefined = keyDataObject.valuesRaw.map(formatter);
            returnObject[objectKey] = keyDataObject;
        }
    }
    return returnObject;
}

function filterFormatter(string) {
    string = string.replaceAll('_',' ');
    return capitalizeFirsts(string);
}

function average(array) {
    return array.reduce((ac,cv) => ac += cv) / array.length;
}

function findValueDeviation(value,average) {
    const returnObject = {};
    returnObject.unit = value - average;
    returnObject.percent = roundToPlace(returnObject.unit * 100 / average,0.01);
    return returnObject;
}

function buildComparisonDiv(price,pricesArrayOrMetricsObject,groupName,parentNode) {
    const div = buildElement('div',null,['comparisonDiv']);

    const header = buildElement('p',`Compared to ${groupName}`,['comparisonHeader']);
    div.appendChild(header);

    /// DETERMINE GROUP METRICS
    // If the pricesArrayOrMetricsObject is an array, then generate a metrics object
    // for it and assign that to groupMetrics, otherwise, assign groupMetrics
    // the value passed to pricesArrayOrMetricsObject so that the function can
    // use the metrics object we pass it
    const groupMetrics = Array.isArray(pricesArrayOrMetricsObject) ?
        findMetrics(pricesArrayOrMetricsObject,[roundToPlace]) :
        pricesArrayOrMetricsObject;

    if (pricesArrayOrMetricsObject.length === 0) console.error('buildComparisonDiv received empty array');

    // Make sure the value we passed to pricesArrayOrMetricsObject is a metrics object
    if (!groupMetrics.isMetricsObject) {
        console.error('Invalid metrics object provided');
        return groupMetrics;
    }

    /// CREATE AND FILL COMPARISON MESSAGE
    const comparisonMessage = buildElement('p');

    s(groupMetrics)
    const difference = findValueDeviation(price,groupMetrics.avg);
    s(difference);
    if (difference.unit > 0) {
        comparisonMessage.textContent = `$${formatPrice(difference.unit)} (${difference.percent}%) higher than average`;
    } else if (difference.unit < 0) {
        comparisonMessage.textContent = `$${formatPrice(-1 * difference.unit)} (${-1 * difference.percent}%) lower than average`;
    } else if (difference === 0) comparisonMessage.textContent = 'It is the average price';

    div.appendChild(comparisonMessage);

    // Most/least expensive product messages
    if (price === groupMetrics.max.value) div.appendChild(buildElement('p','This is the most expensive item',['priceWarning']));
    if (price === groupMetrics.min.value) div.appendChild(buildElement('p','This is the least expensive item',['priceWarning']));

    parentNode.appendChild(div);
}

function findMetrics(array,formatters = []) {
    if (!Array.isArray(array)) return undefined;

    max = {
        value: 0
    };
    min = {
        value: 1000000
    };

    /// GENERATE METRICS
    for(const index in array) {
        if (array[index] === null) continue;

        if (array[index] > max.value) {
            max.ids = [];
            max.value = array[index];
        }

        if (array[index] === max.value) {
	        max.ids.push(index);
        }

        if (array[index] < min.value) {
	        min.ids = [];
	        min.value = array[index];
        }
        if (array[index] === min.value) {
            min.ids.push(index);
        }
    }

    let avg = average(array)

    for (const formatter of formatters) {
        avg = formatter(avg);
        max.value = formatter(max.value);
        min.value = formatter(min.value);
    }

    return {
        avg: avg,
        max: max,
        min: min,
        isMetricsObject: true
    }
    
}

function updateFavorite(cell,wasFavorited = true) {
    if (wasFavorited) {
        s(`received by updateFavorite from buildCell: ${cell}`)
        cell.style.backgroundColor = 'pink';
        cell.querySelector('.favoriteButton').textContent = 'Unfavorite';
    } else {
        cell.style.backgroundColor = 'white';
        cell.querySelector('.favoriteButton').textContent = 'Favorite';
    }
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

    Translate currency
    -Should be taken care of before cell is built
    -No cell should list pounds
    Enact:
    -In buildCell
    -Before price formatting
    -Multiply unformatted price by a multiplier stored in an exchange rates object


    getFiltrations(array of objects(objs), array of keys to search thru(keys),beautifier,alphebetizeOption) {
        initialize returnObject
        for each key in object 1 of objs {
            (if that key is contained in the keys array)
            if (!!keys.find(cv => cv === key)) {
                initialize the keyDataObject = {
                    nameRaw: key,
                    nameRefined: key.beautifier(),
                    valuesRaw: [],
                    valuesRefined; []
                }
                initialize valuesSet = {}
                for each object in objs {
                    if (not an array) {
                    valuesSet.add(object.key)
                    }
                    if (is an array) {
                        for each element of array {
                            valuesSet.add(object.key[element])
                        }
                    }
                }
                keyDataObject.valuesRaw = Array.from(valuesSet)
                if (alphabetize) keyDataObject.valuesRaw.sort();
                keyDataObject.valuesRefined = keyDataObject.valuesRaw.map(beautifier);
                returnObject.key = keyDataObject;
            }
        }
        return keyDataObject;
    }


    for each key in keysToLookFor {
        for each key in arrayOfObjects[0] {
            if (key === key)
        }
    }
    ^Runs thru all keys in object for each key in keysToLookFor
    Runs thru 10 keys 3 times

    Vice Versa
    ^Runs thru all keys in keysToLookFor for each key in object
    runs thru 3 keys 10 times

*/