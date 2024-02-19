import './style.css';

class Carouflix {
    config = {
        imageStep: 1,
        transitionTime: 1,
        imageDisplayed: 1,
        backgroundColor: 'transparent',
    }
    counterValues = {};
    allItems = [];
    imageWidth = 0;
    dataSet = [];
    arrayCounterStart = 0;
    arrayCounterEnd = 0;
    sliderCounterStart = 0;
    sliderCounterEnd = 0;
    slider = "";
    globalArray = [];
    maxLeftOffset = 0;
    pending = false;

    constructor(dataSet, config) {
        this.config = config;
        this.dataSet = dataSet;
        this.arrayCounterEnd = this.config.imageDisplayed;
        this.sliderCounterStart = this.config.imageStep;
        this.sliderCounterEnd = this.config.imageDisplayed + this.config.imageStep - 1;

        //evite d'avoir un image displayed superieur au nb d'image
        if(this.config.imageDisplayed > this.dataSet.length) {
            this.config.imageDisplayed = this.dataSet.length;
        }

        const root = document.documentElement;
        const container = document.getElementsByClassName('carouflix')[0];

        //create DOM element for the carouselle
        //left button
        const leftButton = document.createElement("button");
        leftButton.setAttribute('id', 'left-arrow');
        leftButton.setAttribute('class', 'arrow');
        leftButton.addEventListener('click', () => {
            this.goTo('left')
        });

        //right button
        const rightButton = document.createElement("button");
        rightButton.setAttribute('id', 'right-arrow');
        rightButton.setAttribute('class', 'arrow');
        rightButton.addEventListener('click', () => {
            this.goTo('right')
        });

        //slider
        const slider = document.createElement("div");
        slider.setAttribute('class', 'slider');

        //add element to the DOM
        container.append(leftButton);
        container.append(rightButton);
        container.append(slider);

        //initialisation des valeurs
        this.imageWidth = container.offsetWidth / this.config.imageDisplayed;
        this.maxLeftOffset = this.imageWidth * (this.config.imageDisplayed + 2 * this.config.imageStep)
        root.style.setProperty('--transition-time', this.config.transitionTime + 's');
        root.style.setProperty('--item-width', this.imageWidth + 'px');
        root.style.setProperty('--slider-width', ((this.config.imageDisplayed + 2 * this.config.imageStep) * this.imageWidth) + 'px');
        root.style.setProperty('--slider-left', (this.config.imageStep * this.imageWidth * -1) + 'px');
        root.style.setProperty('--carouflix-background-color', this.config.backgroundColor);

        let arrayKeyProvisoire = 0;
        for (let index = 0; index < this.config.imageDisplayed + 2*this.config.imageStep; index++) {
            const leftOffset = this.imageWidth * index;
            if(index < this.config.imageStep || index >= this.config.imageDisplayed + this.config.imageStep) {
                const myImg = this.imageFactory(slider, index);
                this.globalArray[index] = {htmlElement: myImg, leftOffset: leftOffset, arrayKey: null};
                this.globalArray[index].htmlElement.src = "";
                this.globalArray[index].htmlElement.style.left = this.globalArray[index].leftOffset + 'px';

            } else if(index < this.config.imageStep + this.config.imageDisplayed) {
                const myImg = this.imageFactory(slider, index);
                this.globalArray[index] = {htmlElement: myImg, leftOffset: leftOffset, arrayKey: arrayKeyProvisoire};
                this.globalArray[index].htmlElement.src = this.dataSet[index - this.config.imageStep];
                this.globalArray[index].htmlElement.style.left = this.globalArray[index].leftOffset + 'px';
                arrayKeyProvisoire++
            }
        }
    }

    imageFactory(slider, index) {
        let img = document.createElement("img");
        img.classList.add('item');
        img.setAttribute('id', `item${index}`)
        slider.append(img);
        return img;
    }

    goTo(leftOrRight) {
        if(!this.pending) {
            this.pending = true;
            //determine le sens
            let stepFunction = this.config.imageStep
            if(leftOrRight === 'right') {
                stepFunction = this.config.imageStep * -this.imageWidth
            } else if(leftOrRight === 'left') {
                stepFunction = this.config.imageStep * this.imageWidth
            }

            Promise.all([this.setSrcToImg(leftOrRight), this.setNewLeftOffset(stepFunction)]).then(() => {
                    this.slideImages(leftOrRight).then(() => {
                        this.unsetSrcImages(leftOrRight).then(() => {
                            this.pending = false;
                        });
                        if(leftOrRight === 'right') {
                            this.sliderCounterStart = (this.sliderCounterStart + this.config.imageStep) % this.globalArray.length;
                            this.sliderCounterEnd = (this.sliderCounterEnd + this.config.imageStep) % this.globalArray.length;
                        } else if(leftOrRight === 'left') {
                            this.sliderCounterStart = (this.sliderCounterStart - this.config.imageStep + this.globalArray.length) % this.globalArray.length;
                            this.sliderCounterEnd = (this.sliderCounterEnd - this.config.imageStep + this.globalArray.length) % this.globalArray.length;
                        }
                    });
                })
        }
            
    }

    setSrcToImg(leftOrRight) {
        return new Promise((resolve) => {
            if(leftOrRight === 'right'){
                for (let index = 0; index < this.config.imageStep; index++) {
                    const nextGlobalArrayIndex = (this.sliderCounterEnd + 1 + index) % this.globalArray.length;
                    const nextArrayKey = (this.globalArray[(this.sliderCounterEnd + index) % this.globalArray.length].arrayKey + 1) % this.dataSet.length;
                    this.globalArray[nextGlobalArrayIndex].htmlElement.src = this.dataSet[nextArrayKey];
                    this.globalArray[nextGlobalArrayIndex].arrayKey = nextArrayKey;
                }
    
            } else if (leftOrRight === 'left') {
                for (let index = 0; index < this.config.imageStep; index++) {
                    const nextGlobalArrayIndex = (this.sliderCounterStart - 1 - index + this.globalArray.length) % this.globalArray.length;
                    const previousArrayKey = ((this.globalArray[(this.sliderCounterStart - index + this.globalArray.length) % this.globalArray.length].arrayKey - 1) + this.dataSet.length) % this.dataSet.length;
                    this.globalArray[nextGlobalArrayIndex].htmlElement.src = this.dataSet[previousArrayKey];
                    this.globalArray[nextGlobalArrayIndex].arrayKey = previousArrayKey;
                }
            }
            resolve();
        })
    }

    setNewLeftOffset(stepFunction) {
        return new Promise((resolve) => {
            this.globalArray.forEach(element => {
                element.leftOffset = (element.leftOffset + stepFunction + this.maxLeftOffset) % this.maxLeftOffset
            });
            resolve();
        })
    }

    slideImages() {
        return new Promise((resolve) => {
            this.globalArray.forEach(element => {
                element.htmlElement.style.left = element.leftOffset + 'px'
            });
            setTimeout(() => {
                resolve();
            }, 800)
        })
    }

    unsetSrcImages(leftOrRight) {
        return new Promise((resolve) => {

            for (let index = 0; index < this.config.imageStep; index++) {
                if(leftOrRight === 'right') {
                    const myIndex = (this.sliderCounterStart + index) % this.globalArray.length;
                    this.globalArray[myIndex].htmlElement.src = "";
                    this.globalArray[myIndex].arrayKey = null;    
                } else if(leftOrRight === 'left') {
                    const myIndex = (this.sliderCounterEnd - index + this.globalArray.length) % this.globalArray.length;
                    this.globalArray[myIndex].htmlElement.src = "";
                    this.globalArray[myIndex].arrayKey = null; 
                }
            }
            resolve();
        })
        }
}

export default Carouflix;
//140