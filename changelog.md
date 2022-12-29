### 64 Changelog ref 64
- Fixed bug with ```findValueDeviation()``` that caused the returned object's ```.unit``` key to be NaN due to using the wrong key name
- Moved code that found maximum, minimum and average values into its own reference at ```findMetrics()```
    - ```findMetrics()``` accepts an array of values and an array of formatter functions
    - ```finMetrics()``` returns an object containing the average, maximum and minimum values of the selection as well as a list of all index at which minimum and maximum values occur
    - If ```findMetrics()``` receives an array of formatter functions, it will pass the average, minimum and maximum values through all the formatter functions one after another before returning the final object containing the metrics
- Implemented a for loop to iterate through calculating price deviations against several groups
- ```roundToPlace()```'s place parameter now defaults to 0.01
    - This way, it can operate as a callback function without a workaround to somehow recognize when it's being used and pass a value into it
    - ```roundToPlace()``` is passed as a callback function to ```findMetrics()``` as a formatter function
-  Renamed ```avg```, ```min``` and ```max``` variables to ```selectionAvg```/```min```/```max``` to be more meaningful
    - Additionally updated the HTML tags for each element to the updated variable name for consistency
- Introduced ```selectionMetrics``` to globally store the metrics object of the filtered products' prices
    - This way, metrics for the selection will not have to be recalculated upon every comparison

### 63 Changelog ref 63
- Wrote function ```findValueDeviation()```, which takes a value and an average and returns an object containing the difference between the value and the average and the percent difference between the value and average
- Wrote function ```average()``` which reduces an array of numbers into its sum, then divides it by its length
- Updated calculation of deviations to use these functions instead of performing calculations inside the string interpolations

### 62 Changelog ref 62
- Wrote function ```getFiltrations()``` which is an updated version of ```createArrayOfValuesStoredInKey()```
    - ```getFiltrations()``` creates key-data objects that contain the raw name of the key it was passed, the formatted name of the key it was passed, a list of all raw values stored in the given key across all objects, and an array of the raw values formatted
    - ```getFiltrations()``` accepts an array of key names that it will generate a key-data object for, and will return an object containing all of those key-data objects
    - ```getFiltrations()``` accepts a function to use as its formatter, so different formats may be applied if the desired display format changes
    - ```getFiltrations()``` has an optional alphabetizer parameter, which if it is provided a truthy value, it will alphabetize the lists of raw and refined values
- Replaced previous ```.spaced``` and ```.scored``` system used throughout previous filtration code
    - In order to compare against strings present in allProducts, code previously required ```.spaced``` or ```.scored``` situationally due to inconsistency in the data provided by the API
    - But now ```.valuesRaw``` may always be used in these situations
- ```brands```, ```types```, ```categories``` and ```tags``` have all been retired and their functionality has been reworked into ```filtrations.brand```/```product_type```/```category``` and ```tag_list```


### 61 Changelog ref 61
- Added Clear button to color swatches displayed in the metrics column

### 60 Changelog ref 60
- Moved filters into their own div
- Moved tags out of a separate collapsable div and into the filter div
- Created new Sort div
- Changed "Apply Filters" to "Apply Constraints"
- Upon retrieving allProducts, code now adds the product's price as a float into the product object at ```product.parsedPrice```
    - Now, parseFloat() doesn't need to be called whenever the product's price is needed, it can be accessed with the ```.parsedPrice``` key
- Updated the max/min price filters and metrics portion of ```fillDisplay()``` to operate with ```product.parsedPrice``` where they previously parsed the price themselves
- Added sorting functionality
    - Different types of sorts are available on a radio button panel
    - Sorting functionality is in place after filtration code within the event attached to the "Apply Constraints" button
    - Starts by iterating thru all ```[type=radio]``` elements using ```.find()```, looking for an element whose ```.checked``` property returns true
    - Once such a radio element is found, it sets the variable ```sort``` to that element's ```.value``` property
    - ```sort``` is then passed into a switch statement which runs a different ```.sort()``` depending on the value of ```sort```
    - The price-based sorts both operate by simply subtracting ```a.parsedPrice``` and ```b.parsedPrice``` from each other (depending on hi-to-lo or lo-to-hi)
    - The alphabetical sorts first apply ```.toUpperCase()``` and ```clearTags()``` to ```a/b.name``` or ```a/b.brand``` before comparison so that lowercase letters and vestigial html tags do not cause an inaccurate sort

### 59 Changelog ref 59
- Added min and max price range filter
    - Added two more .filter steps into the click event on the "apply filter" button, each which checks if the ```parseFloat()```ed ```cv.price``` is greater/lesser than the ```parseFloat()```ed ```.value``` of one of the two new ```<input type="text">```s inside the new ```<div id="priceRange">```

### 58 Changelog ref 58
- ```createArrayOfValuesStoredInKey()``` now optionally sorts its return arrays alphabetically with its third parameter ```alphabetize``` which is true by default 
- Fixed bug where minimum price displayed as $1000000
    - Was caused by the switch statement within ```fillDisplay()``` triggering the case:
```
case prodPrice === maxPrice.value:
    maxPrice.ids.push(index);
    break;
```
    which would break out of the switch statement before it could get to the case:
```
case prodPrice < minPrice.value:
    minPrice.ids = [];
    minPrice.ids.push(index);
    minPrice.value = prodPrice;
    break;
```
    which was responsible for resetting the minimum from its default value of 1000000
    - Switch statement now replaced with a series of if statements that are not exlcusive of each other (are not else-based)


### 57 Changelog ref 57
- Added "clear" button to the metrics display which hides the ```#hightlight``` div displaying info about the selected product/color
- Moved ```minPrice``` and ```maxPrice``` to global variables, removed ```selectionMin``` and ```selectionMax``` as those values can now be accessed via ```.value``` on the min/maxPrice objects
- Added "Show" button to metrics beneath min and max prices, which changes to a "Back" button once clicked
    - Upon clicking, code iterates thru all cells in the display area. It then iterates through min/maxPrice.ids and looks for a match within the cell's classes, changing ```cell.style.display``` to none if there is no match
    - (Within the ```fillDisplay()``` function, an array of cell ids with the minimum or maximum value is stored within min/maxPrice.ids so that it may be access in the above method)
    - If you click the button while it is currently displaying the min/max, it will revert to the normal selection
    - Applying a new filter and clicking the other min/max show button both set the "back" text to "show"

### 56 Changelog ref 56
- Updated selection average, minimum and maximum values to be held in global variables instead of the first index of a node's ```.classList```
- Created text for when no brand was provided for a product
    - Fixed consequent bugs involved with a ```.brand``` property of ```null```

### 55 Changelog ref 55
- Added Compare and Favorite buttons to product cells
    - They display as two center-aligned grid cells
- Fixed buggy currency formatting
    - Previously it would still create a currency element even if no price was provided (And prepend it onto the "No price listed" message)
    - All currency is now translated to USD
    - In all places where prices are to be displayed, they are multiplied by an exchange rate stored in an ```exchangeRates``` object that has key/value pairs of currency symbols and exchange rates respectively
- Increased margin between hex value and "show products" button within the metrics color display
- When assigning metric values as classes to the metric elements, code now first removes previously assigned class/value before adding the new one so that ```.classlist[1]``` will always reference the most recent value of each metric
- Fixed inaccurate roundToPlace() function, which previously set the multiplier as the ```place``` parameter to the -2 power, now sets it to the -1 power
- Compare button appends certain duplicate nodes of a cell into the metrics panel as well as listing some data about its relative price
    - Upon clicking the "compare" button, the difference and percent difference between the selection average (stored in the first index of the selection average node's ```.classList```) is calculated and a <p> with a message is appended to the metrics column
    - The price is also compared against the selection's minimum and maximum prices to determine if a message declaring so should be appended

### 54 Changelog ref 54
- Code that fills the display with the product cells moved to its own reference ```fillDisplay()```
- Brand names now are run through ```capitalizeFirsts()``` before being appended

### 53 Changelog ref 53
- When viewing a color's metrics, you can now press a button that says "Show Products with this Color" and the display area refills with only products that have a color in ```.product_colors``` with the exact hex value as the one currently dispalyed in the metrics column
    - When a color is brought to the metrics column, the button is created and given a class that is the hex value of the displayed color
    - When the button is pressed, it iterates through ```allProducts```, then iterates through each product's array of ```product_colors``` and returns true if any color's ```.hex_value``` matches the hex value class it was given on creation

### 52 Changelog ref 52
- Color boxes now tint when hovered to indicate that they may be interacted with
- Clicking on a color box brings up color information in the metrics column

### 51 Changelog ref 51
- Metrics column now displays the minimum and maximum prices of the filtered selection
    - When prices are being added to the array of prices to be averaged, they are checked against the previous maximum price (initially 0) to see if they match or are a new maximum
    - If the product's price is equal to the previous max, the index (Within ```filteredProducts```) of that product is added to an array (```maxPrice.ids```) that contains all products with the max price
    - If a new max price is discovered, ```maxPrice.ids``` is cleared and ```maxPrice.value``` is set to the new max price
    - Same system for minimum prices, except the initial minimum is set to 1000000

### 50 Changelog ref 50
- Added a 1em margin to the bottom of all ```colorsDiv```s that arent followed by a ```<p>```
- Site now loads the first 12 products after a successful fetch
- Changed z indexes of pop out dialogues and the message bar to appear over other elements
- Site now sends error messages if db.json could not be reached
- The average price of all displayed products is now shown in the metrics column
    - Average is calculated by iterating thru the ```filteredProducts``` array and pushing all values (that arent null) into an array of ```prices```, then reducing the array of ```prices``` via addition, then dividing it by the length of the ```prices``` array

### 49 Changelog ref 49
- Created grid for displaying the filtered products
- Created color displays for each product with a pop out menu displaying more colors when available
    - Iterated thru first 6 elements of ```product.product_colors```, adding each's ```.hex_value``` as the ```background-color``` of a new small ```div``` element that would be added into a grid called ```colorsDiv``` inside the product's cell
    - Set the ```colorsDiv```'s ```grid-template-columns``` property to update dynamically based on how many colors were to be displayed
    - If more than 6 colors are in the array, a ```p``` element with the content "more colors" is added onto the cell
        - Hovering over this element displays a dropdown with the rest of the colors
- Added a placeholder empty "Metrics" div on the right side of the grid

### 48 Changelog ref 48
- Moved user div to top right
- Put filtration menu and display area in a grid
- Made filtration menu sticky

### 47 Changelog ref 47
- Created show/hide button for the tags area
- Added "Filter Products" title to the filtration menu
- Converted pixel units to em
- Broad stylistic changes to appearance

### 46 Changelog ref 46
- Created sidebar for filtration menu
    - Styled sidebar
    - Styled select elements within sidebar

### 45 Changelog ref 45
- ```buildCell()``` now removes ```<br>``` tags put in place by the api, replacing them with a space

### 44 Changelog ref 44
- Set login and register functionality to set the buttons to inactive after successfully firing
    - Previously, changing states to inactive was triggered by a keydown event that checked for empty text inputs, so even though logging in/registering cleared the text input, it didn't trigger the keydown event that changed the buttons to inactive
- Added messages for errors and successes in logging in/registering

### 43 Changelog ref 43
- Modified ```easeArray()``` to take an amount of time in seconds (and framerate) over which the ease is meant to cover and then determine how many points should be in the returned geometric sequence
    - Renamed it to ```createGeometricSeq()``` to provide more meaning
- Created ```moveAlongArray()``` which sets a given property of a given node to each value of a given array in sequence every frame
- Created ```produceFinal()``` which creates the final value to set the element's property to based on conditions such as 'reverse the array' and 'subtract the number from 0'

### 42 Changelog ref 42
- Created ```easeArray()``` function that returns a geometric sequence of n points starting at zero and ending at the provided distance
- Modified ```sendTopBar()``` to create new elements for each call so that triggering a message rapidly will not result in buggy behavior

### 41 Changelog ref 41
- Created message topbar that displays messages about various triggers
- Changed cursor for inactive buttons
- Login and register buttons now de/activate when the fields go empty or full (fixed timing bug)
    - The check for whether or not the fields were empty was happening in the space between the key being pressed and the field filling
    - Added a millisecond of wait so that the field could fill before the check ran

### 40 Changelog ref 40
- While the username/password fields are empty, the login and register buttons display as inactive and don't run their code

### 39 Changelog ref 39
- Moved user icon outside of the ```logInDiv```
- Added code that hides/shows the user div
- Hides the login form when signed in
- Added log out functionality

### 38 Changelog ref 38
- Added ```encodeURI()``` to the fetch request so that usernames may include special characters
- Added user button which will eventually collapse and expand registration/login functionality
- Updated button hover pseudoclasses to apply a filter rather than just changing the color
    - This applies the color change to images as well and is more forwards compatible
- Created ```inactive``` class for elements, which grays out buttons when their functionality is unavailable

### 37 Changelog ref 37
- Created registration functionality
    - Upon clicking register, the text in the username field is sent as a get request, and if it returns with status 404, it sends a POST request to that same resource containing a username and password object
    - This is to first check that no user with that id exists before writing in data at that resource

### 36 Changelog ref 36
- Created variables ```ok``` and ```status``` within the click event on the log in button that are declared before the fetch so that the response's ```.ok``` and ```.status``` properties may be stored in them within the first .then() and then read in the second .then()
- Created a ```<div>``` for the login area

### 35 Changelog ref 35
- Created db.json to store user information
- Added username and password fields
- Added event to fetch user data and compare it to what was provided
    - Sets ```user``` to the provided username when data matches
    - Sends "Incorrect password" alert when username exists in the json but the password does not match
    - Send "User not found" when the username is not in the json

### 34 Changelog ref 34
- Made message box for currency hover message
- Made class ```.popOutDiv``` to use on all message boxes that pop out on hover

### 33 Changelog ref 33
- Added unlisted currency message to the red dollar sign on hover

### 32 Changelog ref 32
- Deprecated previous storage of index and object separately, now index is simply another value within the object
    - The index key/value is added after loading the json
- Deprecated previous storage of spaced and underscored names, now spaced and underscored names are two values within an option object stored in an array of all option objects

### 31 Changelog ref 31
- Implemented ```capitalizeFirsts()```
- Reworked ```allProducts``` to instead be an array of objects that at ```allProducts.index``` contains its index within ```allProducts``` and at ```allProducts.object``` contains the actual product object itself
- Any functions that previously used simply an index of ```allProducts``` will be updated to use instead the ```.objcet``` key at that index
- With this data structure, a product can provide an absolute reference to its place in the database anywhere it is referenced

### 30 Changelog ref 30
- Created ```capitalizeFirsts()``` function that capitalizes the first letter of each word of a string

### 29 Changelog ref 29
- Applied new css to "Apply Filter" button as well

### 28 Changelog ref 28
- Fixed bug that caused catgory list to contain an empty ```<option>``` and null

### 27 Changelog ref 27
- Options generated by ```populateDropdown()``` now have value attributes based off their index in their array
    - By accessing the value attribute, you can chain it onto its category/type/brand array to access either the spaced or the underscored name
- Updated ```populatedDropdown()``` to take the array of arrays provided by ```createArrayOfValuesStoredInKey()``` instead of just one of the array
    - This way it can directly access the array of underscored names instead of underscoring the values passed to it

### 26 Changelog ref 26
- Set a font family
- Upgraded css for interactables

### 25 Changelog ref 25
- Rename html file to index

### 24 Changelog ref 24
- Fixed bug where filtering with "any" and no tags selected gave no results

### 23 Changelog ref 23
- all/any functionality implemented!

### 22 Changelog ref 22
- When product.price is 0 or null, the price element states "price unlisted"
- When product.price_sign is null, the price element shows the currency as USD, but the "$" is red, and hovering over it explains that no currency type was provided
    - Split price into two elements, one for the sign and one for the number
    - Edited dispay properties and added more line breaks
- Changed default dropdowns to say "loading..." while loading and "select" afterward

### 21 Changelog ref 21
- Updated checkboxed to be checkable by clicking the label
    - Had to use ```label.setAttrbute('for',id)``` instead of ```label.for = id```
    - Not sure why

### 20 Changelog ref 20
- Text introducing tags now states "Show products that are tagged with all of the following"
    - "all" may be clicked on to change it to "any", which communicates the intent of the filtration to the script
    - "all" changes color and the cursor type when hovered over to emphasize its interactability

### 19 Changelog ref 19
- Added code that sets ```checkedTags``` to an array of the checked elements' values as opposed to the elements themselves
- Filters ```filteredProducts``` by each tag in ```checkedTags```

### 18 Changelog ref 18
- Fixed bug that caused checkboxes' ```.value``` properties to be ```undefined```
- Fixed bug that gave checkboxes a class of "false"
- Added code that identifies checked tag boxes and creates an array of them

### 17 Changelog ref 17
- Added for loop that creates cells for each product in ```filteredProducts```
- Gives all elements of a cell a matching class value so that one element may be used to identify its product

### 16 Changelog ref 16
- Deprecated ```filterByKeyValue()``` because ```buildCell()``` now takes product objects, an array of which can be produced by using ```.filter()``` on ```allProducts```
- Implemented if statements that detect which filters are active, and then apply them

### 15 Changelog ref 15
- Updated price formatting to account for numbers with digits in the 10s place and higher

### 14 Changelog ref 14
- Updated ```buildCell()``` function to take a product object and id instead of an index to be retrieved

### 13 Changelog ref 13
- Changed method of filtering functionality
    - Previously planned on invoking each element of an array of filtration functions using a for block
    - Previous plan didn't mesh well with ```buildCell()``` function, which builds a cell based on its index value in ```allProducts``` (running ```.filter()``` on ```allProducts``` would return an array of the objects, themselves, not their ids)
    - Created new function ```filterByKeyValue()``` that returns an array of indexes at which there is an object that has a key value pair that matches the key and value arguments provided to the function

### 12 Changelog ref 12
- Site now loads first 10 cells upon loading completion

### 11 Changelog ref 11
- Randomize button changed to Apply Filter
- Test keydown event removed

### 10 Changelog ref 10
- ```populateDropdown()``` no longer asks for a ```value``` parameter
    - ```option.value``` is now set to the ```value``` parameter with underscores instead of spaces to allow it to be used as a value attribute

### 9 Changelog ref 9
- Added default values to dropdowns
- Updated ```createArrayOfValuesStoredInKeys()```
    - Now returns array of two arrays
    - First array [0] is for viewing (spaces instead of underscores)
    - Second array [1] is for scripting (vice versa)
- Updated ```buildElement()``` to only add an id when id is given a value
- Added Tags div
    - Fleshed out with code that creates a checkbox, label and break for each tag
- Added code snippets to changelog

### 8 Changelog ref 8
- Abstracted code that gets array of all brands into function ```createArrayOfValuesStoredInKey()```
- Added ability to detect arrays and add their elements into the return array
- Temporarily created tag dropdown: To be replaced with checkboxes to select multiple tags

### 7 Changelog ref 7
- Added ```populateDropdown()``` function that adds items from an array into a provided ```<select>``` element
- Created brands array that stores all brands
    - Created by iterating thru ```allProducts``` and adding the brand to an object

### 6 Changelog ref 6
- Added code to format the price into 3 digits

### 5 Changelog ref 5
- Function that creates cell&image moved to its own reference ```buildCell()```
- Cell now displays product name, brand and price
    - Clicking brand links to brand's site
    - Elements for name, brand and price have css classes for mass editing

### 4 Changelog ref 4
- Added display area to house product cells
- Randomize button creates a cell and appends an image into it

### 3 Changelog ref 3
- Upgraded loading message
    - DOM ```<h1>``` element
    - Uses sine to oscillate opacity
    - Hides itself when ```allProducts``` becomes truthy/filled
    - Removed alert

### 2 Changelog ref 2
- Pushed changelog

### 1 Changelog ref 1
- addEventListener shortcut function ```a()``` renamed to ```ael()```
- Sends alert when attempting test before load is complete
- loads list of 10 latest fetched elements into ```<ul id='test'>``` upon keydown