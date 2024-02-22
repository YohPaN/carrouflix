# Introduction
A JavaScript package that provides a fluent infinite slider/carousel. When you reach the end of the slider, it will restart from the beginning, and you will see nothing.

# Table of content
* [Getting Started](#getting-started)
    * [Installation](#installation)
    * [Integration](#integration)
    * [Important](#important)
    * [Code example](#code-example)
* [Documentation](#documentation)
    * [Array of picture pacths](#array-of-picture-paths)
    * [Configuration](#configuration)
    * [Styling](#styling)


# Getting Started

## Installation

`npm install carouflix`

## Integration
* Import Carouflix
`import Carouflix from 'carouflix'`
* Add a "div" element in your DOM with class name "carouflix". This one will determine the slider dimension
`<div class="carouflix"></div>`
* Define a new instance of Carouflix
`new Carouflix(...)`
* Provide an array of image paths and a config object according to the documentation

## Important  
The DOM must be fully loaded when you declare instance of Carouflix class. Otherwise, the package will not be able to do its job. For exemple in React, wrap the declaration of the new instance into "useEffet":
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

new Carouflix(imageList, config);
```
### Your HTML
```html 
<div className="carouflix"></div>

```

# Documentation

## Array of picture paths
It must be an array that contain only string, representing pictures path into your folders. The leftmost image display will be the first in the array.  
**Tips**: you can use fs and path from node.js to build your picture paths array.

## Configuration  

You can configure many things with config object.
There is two type of configuration, "setup" and "style" that are handle by their own object into the config object.

### Setup
This one define the slider behavior.  
- **imageStep:**  
Define the scrolling step in number of images.  

- **transitionTime:**  
Define the slidding time in seconde.  

- **imageDisplayed:**  
Define the number of image displayed.  

- **stopOnLastPicture:**  
Stop the slider on the last image if it's true.  
- **aWraper:**  
Configure image to receive "a" element if it's true. You need to define an array of href for each images.  

### Style
This is for styling your slider.
- **backgroundColor:**  
Set the background color of the slider. Its support all CSS \<color> (RGB, Hexadecimal, HSL, ect...).

- **useDefaultnavigationToggle:**  
Let you choose your own logo for navigation toggle if it's false. Then, with CSS selectors and [CSS values](#css-values), you can append your navigation toggle into "navigation-toggle" class.

- **navigationToggleSize:**  
You can choose between three navigation toggle size: sm, md, xl.

- **color:**  
If you use default navigation toggle, you can choose between "black" or "white" color.


Here is the config object structure and default values:
```
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
Like said in [Integration](#integration) part, the div with class name "carouflix" will determine the width and height of the slider.
By default, each pictures will take 100% of the height of the slider.

### CSS values
There is some CSS values to let you modify as you will.

* ".navigation-toggle" => container for navigation toggles

* ".item" => container for items/pictures.  
It contain "a" element if "config.setup.aWraper" is true or directly the "img" element if it's false  

* "a" => contain the image
* "img" => for exemple, use ".carouflix img {...}" to modify your images
