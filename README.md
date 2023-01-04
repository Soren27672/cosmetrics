# Cosmetrics

### Primary Features
- Display product information about cosmetic items from the public Makeup API (http://makeup-api.herokuapp.com/)
    - Name
    - Brand
    - Price (if provided)
    - A currency unlisted message (if none is provided)
    - Colors offered
- Filter and sort cosmetic items on the webpage based on user input
- Compare the price of cosmetic items to others of the same type or brand
- Log in and register accounts
- Add items to a list of favorites

### Interactable Features Rundown
In the left panel, you can filter and sort products
Products can be filtered based on 
- Brand
- Product type
- Category
- Price range
- Tags
    - Filtering based on tags can alternate between products containing *all* checked tags or products containing *any* checked tags
Products can be sorted based on
- Price high to low or low to high
- Alphabetically or reverse alphabetically by name
- Alphabetically or reverse alphabetically by brand

In the right panel, information about the current displayed selection is listed
- The average price
- The maximum price
- A show maximum button, which shows only products that have the maximum price
- The minimum price
- A show minimum button, which shows only products that have the maximum price

By clicking compare on a product's cell, you can see more information about that product in the panel on the right
- The product's decription
- The product's dollar and percent difference from the average of the current displayed selection
- from the average of all products by the same brand
- and from the average of all products of the same type
- Warnings if a product is the most or least expensive of those selections
- A button to clear the item from the panel

By clicking on a color swatch you can see more information such as
- The color's name (if provided)
- The color's hex value
- All other product's featuring that exact color

By clicking on the user icon in the top right, you can sign in to or register accounts
- This feature relies on json-server to mimic a server
- Once signed in, you can click favorite button to add a product to your favorite
- Clicking the favorites button in the user options displays all products favorited by the user

Resizing the window will adjust the display
- The left and right panels will resize their center panel
- The left and right panels will have a consistenly sized header and footer
- The display grid will adjust the number of columns displayed

### Invisible features
Produces a geometric sequence that will span from a start point to an end point in a given number of steps

Capitalizes the first letter of every word in a string

Formats a floating point number into a currency format

Produces an array of all unique values stored under a single key across several objects

Populates an HTML select element with an array

Rounds a floating point number to a provided decimal place

### Special Thanks
- To icons8 for their lipstick and user icons
- https://icons8.com/
- https://icons8.com/icon/E9q2phkF8I39/lipstick
- https://icons8.com/icon/98957/user