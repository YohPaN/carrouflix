import './style.css';

class Carouflix {
    config = {
        setup: {
            imageStep: 1,
            transitionTime: 1,
            imageDisplayed: 1,
            stopOnLastPicture: true,
            aWraper: false,
        },
        style: {
            backgroundColor: 'transparent',
            useDefaultNavigationToggle: true,
            navigationToggleSize: 'md',
            color: 'white',
        },
    }

    imageWidth = 0;
    dataSet = [];
    dataSetHref = [];
    sliderCounterStart = 0;
    sliderCounterEnd = 0;
    slider = {};
    globalArray = [];
    maxLeftOffset = 0;
    pending = false;
    imageDisplayedPlusImageStep = 0;
    containerScale = 0;

    /**Construction of the Carouflix class
     * @constructs Carouflix
     * @param {Array} dataSet 
     * @param {Object} config 
     */
    constructor(container, dataSet, config, dataSetHref) {
        this.inputValidation(container, dataSet, config, dataSetHref);

        this.config.setup = {...this.config.setup, ...config.setup};
        this.config.style = {...this.config.style, ...config.style};
        this.dataSet = dataSet;
        if(this.config.setup.aWraper) {
            this.dataSetHref = dataSetHref;
        }
        this.sliderCounterStart = Math.max(this.config.setup.imageStep, this.config.setup.imageDisplayed);
        this.imageDisplayedPlusImageStep = this.config.setup.imageDisplayed + this.config.setup.imageStep
        this.sliderCounterEnd = Math.max(this.imageDisplayedPlusImageStep - 1, this.config.setup.imageDisplayed * 2 - 1);
        this.imageWidth = container.offsetWidth / this.config.setup.imageDisplayed;
        this.maxLeftOffset = this.imageWidth * Math.max(this.imageDisplayedPlusImageStep + this.config.setup.imageStep, this.config.setup.imageDisplayed * 3);
        this.pxToVw = document.documentElement.clientWidth / 100;

        this.initialization(container);
    }

    /**Initialization of the slider by creating the DOM element, defining CSS values and setting up first images to display
     * @function initialization
     * @param {HTMLDivElement} container 
     */
    initialization(container) {
        const root = document.documentElement;
        this.domCreation(container);
        
        //Initialization of css values
        root.style.setProperty('--scale', this.containerScale);
        root.style.setProperty('--transition-time', this.config.setup.transitionTime + 's');
        root.style.setProperty('--item-width', this.imageWidth / this.pxToVw + 'vw');
        root.style.setProperty('--slider-width', (Math.max(this.imageDisplayedPlusImageStep + this.config.setup.imageStep, this.config.setup.imageDisplayed * 3) * this.imageWidth) / this.pxToVw + 'vw');
        root.style.setProperty('--slider-left', Math.min(this.config.setup.imageStep * this.imageWidth * -1, this.config.setup.imageDisplayed * this.imageWidth * -1)  / this.pxToVw + 'vw');
        root.style.setProperty('--carouflix-background-color', this.config.style.backgroundColor);
        root.style.setProperty('--color', this.config.style.color);

        switch (this.config.style.navigationToggleSize) {
            case 'sm':
                root.style.setProperty('--navigation-toggle-size', 20 + 'px');
                break;
            case 'md':
                root.style.setProperty('--navigation-toggle-size', 50 + 'px');
                break;
            case 'xl':
                root.style.setProperty('--navigation-toggle-size', 100 + 'px');
                break;
        }

        this.setUpFirstImages();
    }

    /**Input validation for dataSet and config Ojbect
     * @function
     * @param {Object} config
     * @param {Array} dataSet  
     * @param {Array} dataSetHref
     * @param {HTMLElement} container  
     */
    inputValidation(container, dataSet, config, dataSetHref) {

        if(container === undefined) {
            throw new Error('You need to define a HTML element and wait for the DOM was fully load')
        }

        const testContainer = container;
        const testInsert = document.createElement('div');
        try {
            testContainer.append(testInsert);
        } catch (error) {
            throw new Error('You need to provide a valid HTML element')
        }


        if(config === undefined) {
            throw new Error('You need to provide an array of image paths and a config object, even if config object is empty')
        }
        if(!Array.isArray(dataSet)) {
            throw new TypeError("dataSet must be an array");
        }

        if(dataSet.length < 1) {
            throw new RangeError("dataSet must contain at least one element");
        }

        if (dataSet.some(element => typeof element !== 'string')) {
            throw new TypeError("dataSet values must be strings");
        }
        if(config.setup.hasOwnProperty('aWraper')) {
            if(config.setup.aWraper) {
                if(dataSetHref === undefined) {
                    throw new Error("dataSetHref must be set if config.setup.aWraper is true");
                }
                if(!Array.isArray(dataSetHref)) {
                    throw new TypeError("dataSetHref must be an array");
                }
                if(dataSetHref.length < 1) {
                    throw new RangeError("dataSetHref must contain at least one element");
                }
                if (dataSetHref.some(element => typeof element !== 'string')) {
                    throw new TypeError("dataSetHref values must be strings");
                }
                if (dataSetHref.length != dataSet.length) {
                    throw new TypeError("dataSetHref must have the same length as dataSet");
                }
            }
        }
        if(config.setup.hasOwnProperty('imageDisplayed')) {
            if(config.setup.imageDisplayed > dataSet.length) {
                throw new Error("The number of image displayed can't be superior to dataSet.")
            }
        }
        
        for(let subConfig in config) {
            switch (subConfig) {
                case 'setup':
                    this.configValidationSwitch(config[subConfig]);
                    break;
                case 'style':
                    this.configValidationSwitch(config[subConfig]);
                break;
                default:
                    throw new Error('parameter not recognize: ' + subConfig);
            }
        }
    }

    /**Switch used to test each value of config object
     * @function
     * @param {Object} subConfig 
     */
    configValidationSwitch(subConfig) {
        const backgroundColor = new Option().style;
        const color = new Option().style;


        for(let setup in subConfig) {
            switch (setup) {
                case 'imageStep':
                    if(typeof subConfig['imageStep'] != 'number') {
                        throw new TypeError('config.setup.imageStep must be a Number');
                    } else if(subConfig['imageStep'] < 1) {
                        throw new Error('config.setup.imageStep must be greater than one');
                    }
                    break;
                case 'transitionTime':
                    if(typeof subConfig['transitionTime'] != 'number') {
                        throw new TypeError('config.setup.transitionTime must be a Number');
                    } else if(subConfig['transitionTime'] <= 0) {
                        throw new Error('config.setup.transitionTime must be greater than zero');
                    }
                    break;
                case 'imageDisplayed':
                    if(typeof subConfig['imageDisplayed'] != 'number') {
                        throw new TypeError('config.setup.imageDisplayed must be a Number');
                    } else if(subConfig['imageDisplayed'] < 1) {
                        throw new RangeError('config.setup.imageDisplayed must be greater than one');
                    }
                    break;
                case 'stopOnLastPicture':
                    if(typeof subConfig['stopOnLastPicture'] != 'boolean') {
                        throw new TypeError('config.setup.stopOnLastPicture must be a Boolean');
                    }
                    break;
                case 'aWraper':
                    if(typeof subConfig['aWraper'] != 'boolean') {
                        throw new TypeError('config.setup.aWraper must be a Boolean');
                    }
                    break;
                case 'backgroundColor':
                    backgroundColor.color = subConfig['backgroundColor'];
                    if(backgroundColor.color === "") {
                        throw new Error('config.style.backgroundColor must be a valid CSS <color>');
                    }
                    break;
                case 'color':
                    color.color = subConfig['color'];
                    if(color.color === "") {
                        throw new Error('config.style.color must be a valid CSS <color>');
                    }
                    break;
                case 'useDefaultNavigationToggle':
                    if(typeof subConfig['useDefaultNavigationToggle'] != 'boolean') {
                        throw new TypeError('config.style.useDefaultNavigationToggle must be a Boolean');
                    }
                    break;
                case 'navigationToggleSize':
                    if(!['sm', 'md', 'xl'].includes(subConfig['navigationToggleSize'])) {
                        throw new Error('config.style.navigationToggleSize must be a "sm", "md" or "xl"');
                    }
                    break;
                default:
                    throw new Error('parameter not recognize: ' + setup);
            }
        }
    }

    /**Create DOM elements for the slider
     * @function domCreation
     * @param {HTMLDivElement} container
     * @returns {HTMLDivElement} Return slider element 
     */
    domCreation(container) {
        //button
        const leftButton = this.navigationToggleButtonFactory('left');
        const rightButton = this.navigationToggleButtonFactory('right');

        //slider
        this.slider = document.createElement("div");
        this.slider.setAttribute('class', 'slider');

        //add element to the DOM
        container.append(leftButton);
        container.append(rightButton);
        container.append(this.slider);
    }

    /**Factory to build buttons to navigate into the slider
     * @function navigationToggleButtonFactory
     * @param {String} direction
     * @returns {HTMLButtonElement} 
     */
    navigationToggleButtonFactory(direction) {
        const listnerValue = direction === 'left' ? -1 : 1;

        const button = document.createElement('button');
        button.setAttribute('id', `${direction}-navigation-toggle`);
        button.setAttribute('class', 'navigation-toggle');
        button.addEventListener('click', () => {
            this.goTo(listnerValue)
        });

        if(this.config.style.useDefaultNavigationToggle) {
            button.classList.add(`${direction}-navigation-toggle-logo`)
        }

        return button;
    }


    /**Set up first images that will be display
     * @function setUpFirstImages
     */
    setUpFirstImages() {
        let dataSetKey = 0;
        let endLoop = 0;
        let imageDisplayStart = 0;
        let imageDisplayEnd = 0;

        if(this.imageDisplayedPlusImageStep + this.config.setup.imageStep < this.config.setup.imageDisplayed * 3) {
            endLoop = this.config.setup.imageDisplayed * 3;
            imageDisplayStart = this.config.setup.imageDisplayed;
            imageDisplayEnd = this.config.setup.imageDisplayed * 2;
        } else {
            endLoop = this.imageDisplayedPlusImageStep + this.config.setup.imageStep
            imageDisplayStart = this.config.setup.imageStep;
            imageDisplayEnd = this.imageDisplayedPlusImageStep;
        }

        //Main loop to display a number of div, before and after image display, equal to the imageStep and a div for each image display
        for (let index = 0; index < endLoop; index++) {
            const leftOffset = this.imageWidth * index;
            const imageContainer = this.imageFactory(index);

            //If images are not in the display area, we do not defining a src for the img element
            if(index < imageDisplayStart || index >= imageDisplayEnd) {
                this.settingUpGlobalArray(index, imageContainer, leftOffset, null, "", "");

            } else {
                this.settingUpGlobalArray(index, imageContainer, leftOffset, dataSetKey, this.dataSet[index - imageDisplayStart], this.dataSetHref[index - imageDisplayStart]);
                dataSetKey++
            }
            this.globalArray[index].htmlElement.style.left = this.globalArray[index].leftOffset / this.pxToVw + 'vw';
        }
    }

    /**Adding object to globalArray that represent div element with their left offset, src, ect
     * @function settingUpGlobalArray
     * @param {Number} index
     * @param {Array[HTMLElement]} htmlElements
     * @param {Number} leftOffset
     * @param {Number} arrayKey
     * @param {String} src    
     * @param {String} href  
     */
    settingUpGlobalArray(index, htmlElements, leftOffset, arrayKey, src, href) {
        this.globalArray[index] = {htmlElement: htmlElements[0], htmlImage: htmlElements[1], htmlA: htmlElements[2], leftOffset: leftOffset, arrayKey: arrayKey};
        this.globalArray[index].htmlImage.src = src;
        this.config.setup.aWraper ? this.globalArray[index].htmlA.href = href : null;
    }

    /**Factory for img element creation
     * @function imageFactory
     * @param {Number} index 
     * @returns {HTMLDivElement} Return the container with its image
     */
    imageFactory(index) {
        let imgContainer = "";
        const divContainer = document.createElement('div');
        let aWraper = "";
        divContainer.classList.add('item');

        if(this.config.setup.aWraper) {
            aWraper = document.createElement('a');
            aWraper.setAttribute('href', '');
            divContainer.append(aWraper)
            imgContainer = aWraper;
        } else {
            imgContainer = divContainer;
        }

        const img = document.createElement("img");
        img.setAttribute('id', `item${index}`)
        imgContainer.append(img)

        this.slider.append(divContainer);
        return [divContainer, img, aWraper];
    }

    /**Function to navigate through the slider
     * @function goTo
     * @param {Number} direction determine the direction 
     */
    goTo(direction) {
        if(!this.pending) {
            this.pending = true;
            this.setSrcToImg(direction)
                .then((returnArray) => {
                    this.setNewLeftOffset(returnArray[0]) 
                    .then(() => {
                        this.slideImages(direction).then(() => {
                            this.unsetSrcImages(direction, -returnArray[1]).then(() => {
                                this.pending = false;
                            });
                            const addToCounter = (this.config.setup.imageStep - returnArray[1]) * direction * -1;
                            this.sliderCounterStart = this.strictModulo(this.sliderCounterStart - addToCounter, this.globalArray.length);
                            this.sliderCounterEnd = this.strictModulo(this.sliderCounterEnd - addToCounter, this.globalArray.length);
                        });
                    })
                })
        }  
    }

    /**Set src to img element to will be display
     * @function setSrcToImg
     * @param {Number} direction 
     */
    setSrcToImg(direction) {
        return new Promise((resolve) => {

            let stepFunction = 0;
            let offsetRight = 0;
            let counterUsed = 0;

            if(direction === 1) {
                counterUsed = this.sliderCounterEnd
            } else if(direction === -1) {
                counterUsed = this.sliderCounterStart
            }

            for (let index = 0; index < this.config.setup.imageStep - offsetRight; index++) {
                const globalArrayIndex = this.strictModulo(counterUsed + (1 + index) * direction, this.globalArray.length);
                const arrayKey =this.strictModulo(this.globalArray[this.strictModulo(counterUsed + index * direction, this.globalArray.length)].arrayKey + 1 * direction, this.dataSet.length);
                
                if(arrayKey !== 0 || !this.config.setup.stopOnLastPicture || this.config.setup.imageStep === 1) {
                    this.globalArray[globalArrayIndex].htmlImage.src = this.dataSet[arrayKey];
                    this.config.setup.aWraper ? this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey] : null;

                    this.globalArray[globalArrayIndex].arrayKey = arrayKey;
                } else if(arrayKey === 0 && index === 0) {
                    this.globalArray[globalArrayIndex].htmlImage.src = this.dataSet[arrayKey];
                    this.config.setup.aWraper ? this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey] : null;

                    this.globalArray[globalArrayIndex].arrayKey = arrayKey;
                    offsetRight = -(this.config.setup.imageDisplayed - this.config.setup.imageStep) * direction;
                } else if(direction !== -1){
                    offsetRight = this.config.setup.imageStep - index;
                    break;
                } else {
                    this.globalArray[globalArrayIndex].htmlImage.src = this.dataSet[arrayKey];
                    this.config.setup.aWraper ? this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey] : null;

                    this.globalArray[globalArrayIndex].arrayKey = arrayKey;
                    offsetRight = this.config.setup.imageStep - index - 1;
                    break;
                }
            }

            stepFunction = (this.config.setup.imageStep - offsetRight) * this.imageWidth * direction *-1;

            resolve([stepFunction, offsetRight]);
        })
    }

    /**Determine the new left offset for images
     * @function setNewLeftOffset
     * @param {Number} stepFunction 
     */
    setNewLeftOffset(stepFunction) {
        return new Promise((resolve) => {
            this.globalArray.forEach(element => {
                element.leftOffset = this.strictModulo(element.leftOffset + stepFunction, this.maxLeftOffset);
                if(Math.round(element.leftOffset) == Math.round(this.maxLeftOffset)) {
                    element.leftOffset = 0;
                }
            });
            resolve();
        })
    }

    /**Do the slide for each images
     * @function slideImages
     */
    slideImages() {
        return new Promise((resolve) => {
            this.globalArray.forEach(element => {
                element.htmlElement.style.left = element.leftOffset / this.pxToVw + 'vw'
            });
            setTimeout(() => {
                resolve();
            }, this.config.setup.transitionTime * 1000)
        })
    }

    /**Unset src for img that are not display anymore
     * @function unsetSrcImages
     * @param {Number} direction 
     * @param {NUmber} offsetRight 
     */
    unsetSrcImages(direction, offsetRight) {
        return new Promise((resolve) => {
            let counterUsed = 0;
            if(direction === 1) {
                counterUsed = this.sliderCounterStart;
            } else if(direction === -1) {
                counterUsed = this.sliderCounterEnd;
            }

            for (let index = 0; index < this.config.setup.imageStep + offsetRight; index++) {
                const myIndex = this.strictModulo(counterUsed + index * direction, this.globalArray.length);
                this.globalArray[myIndex].htmlImage.src = "";
                this.config.setup.aWraper ? this.globalArray[myIndex].htmlA.href = "" : null;
                this.globalArray[myIndex].arrayKey = null;  
            }
            resolve();
        })
    }

    /**Return strict index of globalArray with modulo to loop
     * @function strictModulo
     * @param {Number} value
     * @param {Number} modulo 
     * @returns {Number} 
     */
    strictModulo(value, modulo) {
        return (value + modulo) % modulo;
    }
}

export default Carouflix;
