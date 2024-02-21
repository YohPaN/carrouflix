import './style.css';

import right_arrow from './assets/right_arrow.png'
import left_arrow from './assets/left_arrow.png'
import right_arrow_black from './assets/right_arrow_black.png'
import left_arrow_black from './assets/left_arrow_black.png'

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
            useDefaultArrow: true,
            arrowSize: 'md',
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
    constructor(dataSet, config, dataSetHref) {
        this.inputValidation(dataSet, config, dataSetHref);
        const container = document.getElementsByClassName('carouflix')[0];

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

        //evite d'avoir un image displayed superieur au nb d'image
        if(this.config.setup.imageDisplayed > this.dataSet.length) {
            throw new Error("The number of image displayed can't be superior to the data set.")
        }

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

        switch (this.config.style.arrowSize) {
            case 'sm':
                root.style.setProperty('--arrow-size', 20 + 'px');
                break;
            case 'md':
                root.style.setProperty('--arrow-size', 50 + 'px');
                break;
            case 'xl':
                root.style.setProperty('--arrow-size', 100 + 'px');
                break;
        }

        this.setUpFirstImages();
    }

    /**Input validation for dataSet and config Ojbect
     * @function
     * @param {Object} config
     * @param {Array} dataSet  
     */
    inputValidation(dataSet, config, dataSetHref) {

        if(config === undefined) {
            throw new Error('dataSet is required and config is required as well, even if it\'s an empty object')
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
        
        if(config.setup.aWraper) {
            console.log("test")
            if(dataSetHref === undefined) {
                throw new Error("dataSetHref must be set if aWraper is true");
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
        const s = new Option().style;

        for(let setup in subConfig) {
            switch (setup) {
                case 'imageStep':
                    if(typeof subConfig['imageStep'] != 'number') {
                        throw new TypeError('imageStep must be a Number');
                    } else if(subConfig['imageStep'] < 1) {
                        throw new Error('imageStep must be greater than one');
                    }
                    break;
                case 'transitionTime':
                    if(typeof subConfig['transitionTime'] != 'number') {
                        throw new TypeError('transitionTime must be a Number');
                    } else if(subConfig['transitionTime'] <= 0) {
                        throw new Error('transitionTime must be greater than zero');
                    }
                    break;
                case 'imageDisplayed':
                    if(typeof subConfig['imageDisplayed'] != 'number') {
                        throw new TypeError('imageDisplayed must be a Number');
                    } else if(subConfig['imageDisplayed'] < 1) {
                        throw new RangeError('imageDisplayed must be greater than one');
                    }
                    break;
                case 'stopOnLastPicture':
                    if(typeof subConfig['stopOnLastPicture'] != 'boolean') {
                        throw new TypeError('stopOnLastPicture must be a Boolean');
                    }
                    break;
                case 'backgroundColor':
                    s.color = subConfig['backgroundColor'];
                    if(s.color === "") {
                        throw new Error('backgroundColor must be a valid CSS <color>');
                    }
                    break;
                case 'useDefaultArrow':
                    if(typeof subConfig['useDefaultArrow'] != 'boolean') {
                        throw new TypeError('useDefaultArrow must be a Boolean');
                    }
                    break;
                case 'arrowSize':
                    if(!['sm', 'md', 'xl'].includes(subConfig['arrowSize'])) {
                        throw new Error('arrowSize must be a "sm", "md" or "xl"');
                    }
                    break;
                case 'color':
                    if(!['white', 'black'].includes(subConfig['color'])) {
                        throw new Error('color must be "white" or "black"');
                    }
                    break;
                case 'aWraper':
                    if(typeof subConfig['aWraper'] != 'boolean') {
                        throw new TypeError('aWraper must be a Boolean');
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
        const leftButton = this.arrowButtonFactory('left');
        const rightButton = this.arrowButtonFactory('right');

        //slider
        this.slider = document.createElement("div");
        this.slider.setAttribute('class', 'slider');

        //add element to the DOM
        container.append(leftButton);
        container.append(rightButton);
        container.append(this.slider);
    }

    /**Factory to build buttons to navigate into the slider
     * @function arrowButtonFactory
     * @param {String} direction
     * @returns {HTMLButtonElement} 
     */
    arrowButtonFactory(direction) {
        const listnerValue = direction === 'left' ? -1 : 1;
        let importImage = null;

        if(this.config.style.color === 'white') {
            importImage = direction === 'left' ? left_arrow : right_arrow;
        } else if(this.config.style.color === 'black') {
            importImage = direction === 'left' ? left_arrow_black : right_arrow_black;
        }

        const button = document.createElement('button');
        button.setAttribute('id', `${direction}-arrow`);
        button.setAttribute('class', 'arrow');
        button.addEventListener('click', () => {
            this.goTo(listnerValue)
        });

        if(this.config.style.useDefaultArrow) {
            const arrow = document.createElement("img");
            arrow.src = importImage;
            button.append(arrow);
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
        this.globalArray[index].htmlA.href = href;
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
                    this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey];

                    this.globalArray[globalArrayIndex].arrayKey = arrayKey;
                } else if(arrayKey === 0 && index === 0) {
                    this.globalArray[globalArrayIndex].htmlImage.src = this.dataSet[arrayKey];
                    this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey];

                    this.globalArray[globalArrayIndex].arrayKey = arrayKey;
                    offsetRight = -(this.config.setup.imageDisplayed - this.config.setup.imageStep) * direction;
                } else if(direction !== -1){
                    offsetRight = this.config.setup.imageStep - index;
                    break;
                } else {
                    this.globalArray[globalArrayIndex].htmlImage.src = this.dataSet[arrayKey];
                    this.globalArray[globalArrayIndex].htmlA.href = this.dataSetHref[arrayKey];

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
                this.globalArray[myIndex].htmlA.href = "";
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
