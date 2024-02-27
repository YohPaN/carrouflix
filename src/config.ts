export interface Config {
    setup: ConfigSetup
    style: ConfigStyle
}

export interface ConfigSetup {
    imageStep: number,
    transitionTime: number,
    imageDisplayed: number,
    stopOnLastPicture: boolean,
    aWraper: boolean,
}

export interface ConfigStyle {
    backgroundColor: string,
    useDefaultNavigationToggle: boolean,
    navigationToggleSize: string,
    color: string,
}

export interface GlobalArrayItems {
    htmlElement: HTMLDivElement, 
    htmlImage: HTMLImageElement,
    htmlAnchor: HTMLAnchorElement,
    leftOffset: number, 
    arrayKey: number | null, 
    src: string, 
    href: string
}
