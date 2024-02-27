interface Config {
    setup: ConfigSetup;
    style: ConfigStyle;
}
interface ConfigSetup {
    imageStep: number;
    transitionTime: number;
    imageDisplayed: number;
    stopOnLastPicture: boolean;
    aWraper: boolean;
}
interface ConfigStyle {
    backgroundColor: string;
    useDefaultNavigationToggle: boolean;
    navigationToggleSize: string;
    color: string;
}
interface GlobalArrayItems {
    htmlElement: HTMLDivElement;
    htmlImage: HTMLImageElement;
    htmlAnchor: HTMLAnchorElement;
    leftOffset: number;
    arrayKey: number | null;
    src: string;
    href: string;
}

declare class Carouflix {
    config: Config;
    imageWidth: number;
    dataSet: string[];
    dataSetHref: string[];
    sliderCounterStart: number;
    sliderCounterEnd: number;
    slider: HTMLDivElement;
    globalArray: GlobalArrayItems[];
    maxLeftOffset: number;
    pending: boolean;
    imageDisplayedPlusImageStep: number;
    pxToVw: number;
    /**Construction of the Carouflix class
     * @constructs Carouflix
     * @param {Array} dataSet
     * @param {Object} config
     */
    constructor(container: HTMLElement, dataSet: string[], config: Config, dataSetHref: string[]);
    /**Initialization of the slider by creating the DOM element, defining CSS values and setting up first images to display
     * @function initialization
     * @param {HTMLDivElement} container
     */
    private initialization;
    /**Input validation for dataSet and config Ojbect
     * @function
     * @param {Object} config
     * @param {Array} dataSet
     * @param {Array} dataSetHref
     * @param {HTMLElement} container
     */
    private inputValidation;
    /**Switch used to test each value of config object
     * @function
     * @param {Object} subConfig
     */
    private configValidationSwitch;
    /**Create DOM elements for the slider
     * @function domCreation
     * @param {HTMLDivElement} container
     * @returns {HTMLDivElement} Return slider element
     */
    private domCreation;
    /**Factory to build buttons to navigate into the slider
     * @function navigationToggleButtonFactory
     * @param {String} direction
     * @returns {HTMLButtonElement}
     */
    private navigationToggleButtonFactory;
    /**Set up first images that will be display
     * @function setUpFirstImages
     */
    private setUpFirstImages;
    /**Adding object to globalArray that represent div element with their left offset, src, ect
     * @function settingUpGlobalArray
     * @param {Number} index
     * @param {Array[HTMLElement]} htmlElements
     * @param {Number} leftOffset
     * @param {Number} arrayKey
     * @param {String} src
     * @param {String} href
     */
    private settingUpGlobalArray;
    /**Factory for img element creation
     * @function imageFactory
     * @param {Number} index
     * @returns {HTMLDivElement} Return the container with its image
     */
    private imageFactory;
    /**Function to navigate through the slider
     * @function goTo
     * @param {Number} direction determine the direction
     */
    private goTo;
    /**Set src to img element to will be display
     * @function setSrcToImg
     * @param {Number} direction
     */
    private setSrcToImg;
    /**Determine the new left offset for images
     * @function setNewLeftOffset
     * @param {Number} stepFunction
     */
    private setNewLeftOffset;
    /**Do the slide for each images
     * @function slideImages
     */
    private slideImages;
    /**Unset src for img that are not display anymore
     * @function unsetSrcImages
     * @param {Number} direction
     * @param {NUmber} offsetRight
     */
    private unsetSrcImages;
    /**Return strict index of globalArray with modulo to loop
     * @function strictModulo
     * @param {Number} value
     * @param {Number} modulo
     * @returns {Number}
     */
    private strictModulo;
}

export { Carouflix as default };
