### 7 Changelog ref 7
- Added populateDropdown function that adds items from an array into a provided \<select> element
- Created brands array that stores all brands
    - Created by iterating thru allProducts and adding the brand to an object

### 6 Changelog ref 6
- Added code to format the price into 3 digits

### 5 Changelog ref 5
- Function that creates cell&image moved to its own reference (buildCell())
- Cell now displays product name, brand and price
    - Clicking brand links to brand's site
    - Elements for name, brand and price have css classes for mass editing

### 4 Changelog ref 4
- Added display area to house product cells
- Randomize button creates a cell and appends an image into it

### 3 Changelog ref 3
- Upgraded loading message
    - DOM \<h1> element
    - Uses sin to oscillate opacity
    - Hides itself when allProducts becomes truthy/filled
    - Removed alert

### 2 Changelog ref 2
- Pushed changelog

### 1 Changelog ref 1
- addEventListener shortcut function 'a()' renamed to 'ael()'
- Sends alert when attempting test before load is complete
- loads list of 10 latest fetched elements into \<ul \#test> upon keydown