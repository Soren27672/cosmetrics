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