import './style.css';

class Carouflix {
    config = {}
    counterValues = {};
    allItems = [];

    constructor(dataSet, config) {
        this.config = config;
        this.config.maxImageStep = dataSet.length * 10

        const root = document.documentElement;
        const container = document.getElementsByClassName('carouflix')[0];

        //create DOM element for the carouselle
        //left button
        const leftButton = document.createElement("button");
        leftButton.setAttribute('id', 'left-arrow');
        leftButton.addEventListener('click', () => {
            this.goTo('left')
        });

        //right button
        const rightButton = document.createElement("button");
        rightButton.setAttribute('id', 'right-arrow');
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
        root.style.setProperty('--transition-time', config.transitionTime + 's');

        //creation des element image
        dataSet.forEach((element, key) => {
            let img = document.createElement("img");
            img.setAttribute('src', element);
            img.classList.add('item');
            img.classList.add(`item${key}`);
            let leftOffset = 10 * key;
            img.style.left = `${leftOffset}vw`;
            slider.append(img);
            this.counterValues[`item${key}`] = 10 * key;
        });
        this.allItems = document.getElementsByClassName('item');
    }

    goTo(leftOrRight) {
        let stepFunction = this.config.imageStep
        if(leftOrRight === 'right') {
            stepFunction = this.config.imageStep * -10
        } else if(leftOrRight === 'left') {
            stepFunction = this.config.imageStep * 10
        }

        for(const [key, val] of Object.entries(this.counterValues)) {
            const myImg = document.getElementsByClassName(key)[0];
            this.counterValues[key] = (val + stepFunction + this.config.maxImageStep) % this.config.maxImageStep
            if(val + stepFunction >= this.config.maxImageStep || val + stepFunction < 0) {
                myImg.style.display = 'none';
            }
        };
    
        this.changeOffsetValues().then(() => {
            for (let index = 0; index < this.allItems.length; index++) {
                this.allItems.item(index).style.display = "block";
            }
        })
    }
    
    changeOffsetValues() {
        return new Promise((resolve) => {
            for (let index = 0; index < this.allItems.length; index++) {
                this.allItems.item(index).style.left = `${this.counterValues[`item${index}`]}vw`;
            }
            setTimeout(() => {
                resolve();
            }, 800)
        })
    }
}

export default Carouflix;
