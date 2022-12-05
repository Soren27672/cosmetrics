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
    - Uses sin to oscillate opacity
    - Hides itself when ```allProducts``` becomes truthy/filled
    - Removed alert

### 2 Changelog ref 2
- Pushed changelog

### 1 Changelog ref 1
- addEventListener shortcut function ```a()``` renamed to ```ael()```
- Sends alert when attempting test before load is complete
- loads list of 10 latest fetched elements into ```<ul \#test>``` upon keydown