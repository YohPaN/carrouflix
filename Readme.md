# Introduction
A JavaScript package that provides a fluent infinite slider/carousel. When you reach the end of the slider, it will restart from the beginning, and you will see nothing.

# Table of content
* [Getting Started](#getting-started)
    * [Installation](#installation)
    * [Integration](#integration)
    * [Important](#important)
    * [Code example](#code-example)
* [Documentation](#documentation)
    * [HTML element](#html-element)
    * [Array of picture pacths](#array-of-picture-paths)
    * [Configuration](#configuration)
    * [Styling](#styling)


# Getting Started

## Installation

`npm install carouflix`

## Integration
* Import Carouflix:
`import Carouflix from 'carouflix'`
* Determine a HTML element that will handle the slider. It will determine the slider dimensions:
```html
<div class="slider-container"></div>
```
* Get your HTMLElement with a `getElementById` or `getElementsByClassName`
* Define a new instance of Carouflix:
`new Carouflix(...)`
* Provide the HTML element, an array of image paths and a config object according to the documentation

## Important  
The DOM must be fully loaded when you declare an instance of Carouflix class. Otherwise, the package will not be able to function correctly. For exemple, in React, wrap the declaration of the new instance in `useEffet`:
### App.js
``` JavaScript
let [loading, setLoading] = useState(true)
  useEffect(() => {
    if(loading) {
        new Carouflix(imageList, config);
    }
    return () => loading = false;
  }, []);
```

## Code example

### Your HTML
```html 
<div class="slider-container"></div>
```

### Your JavaScript
``` JavaScript
import Carouflix from 'carouflix';

...

const imageList = [...pictures_path];

//If you need to wrap your img into a "a" element and become clickable
//const hrefArray = [...pictures_href];

const config= {
    setup: {
        imageStep: 2,
        imageDisplayed: 3,
    }, 
    style: {
        arrowSize: "md",
        backgroundColor: '#9A8B4C',
    },
}

const sliderContainer = document.getElementsByClassName('slider-container');

new Carouflix(sliderContainer, imageList, config);
```


# Documentation

## HTML element
It must be a valid element that will contain the slider. Its dimensions will determine the size of the slider.  
**Tips:** You can add an `id="..."` to your element if you want only one slider, or you can add a `class="..."` to all HTML elements that will contain a slider. Then, loop over the HTMLCollection and instantiate a Carouflix class on each iteration. 

## Array of picture paths
It must be an array containing only strings, representing pictures path in your folders. The leftmost image displayed will be the first in the array.  
**Tips**: you can use `fs` and `path` from node.js to build your picture paths array.

## Configuration  

You can configure many things with the config object.
There are two types of configuration:  
"setup" and "style", each handled by their own object within the config object.

### Setup
This one define the slider behavior.  
- **imageStep:**  
Define the scrolling step in the number of images.  

- **transitionTime:**  
Define the sliding time in seconde.  

- **imageDisplayed:**  
Define the number of images displayed.  

- **stopOnLastPicture:**  
Stop the slider on the last image if true.  
- **aWraper:**  
Configure image to receive an "a" element if true. You need to define an array of href for each images.  

### Style
This is for styling your slider.
- **backgroundColor:**  
Set the background color of the slider. Its support all CSS `<color>` (RGB, Hexadecimal, HSL, ect...).

- **useDefaultnavigationToggle:**  
Let you choose your logo for navigation toggle if false. Then, with CSS selectors and [CSS values](#css-values), you can append your navigation toggle to the "navigation-toggle" class.

- **navigationToggleSize:**  
Choose between three navigation toggle sizes: sm, md, xl.

- **color:**  
If you use the default navigation toggle, you can choose the color.


Here is the config object structure and default values:
```Javascript
const config = {   
    setup: {
        imageStep: number,           //default = 1  
        transitionTime: number,      //default = 1  
        imageDisplayed: number,      //default = 1  
        stopOnLastPicture: boolean,  //default = true  
        aWraper: boolean,            //default = false  
    },  
    style: {  
        backgroundColor: string,     //default = 'transparent'  
        useDefaultnavigationToggle: boolean,    //default = true  
        navigationToggleSize: string,           //default = 'md' 
        color: string,               //default = 'white' 
    },  
}
```

## Styling
As mentioned in [Integration](#integration) part, the parent node of the `div` with the class name "carouflix" will determine the width and height of the slider.
By default, each picture will take 100% of the height of the slider.

### CSS values
There is some CSS values to let you modify as you will.

* ".navigation-toggle" => container for navigation toggles

* ".item" => container for items/pictures.  
It contain "a" element if "config.setup.aWraper" is true or directly the "img" element if it's false  

* "a" => contain the image
* "img" => for example, use ".carouflix img {...}" to modify your images
