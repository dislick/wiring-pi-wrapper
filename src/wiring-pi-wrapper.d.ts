/// <reference path="typings/tsd.d.ts" />
export declare class ChangeWorker {
    private static eventListeners;
    private static isWorking;
    static interval: number;
    /**
     * Adds a handler to the loop
     * @param  {Pin}      pin
     * @param  {function} handler
     */
    static add(pin: Pin, handler: any): void;
    /**
     * Removes a handler from the loop
     * @param  {Pin}      pin
     * @param  {function} handler
     */
    static remove(pin: Pin, handler: any): void;
    private static work();
    private static start();
    private static stop();
}
/**
 * Handles all read/write operations on a given GPIO Pin
 */
export declare class Pin {
    private pinNumber;
    private mode;
    private eventListeners;
    constructor(pinNumber: number, mode: PinModes);
    /**
     * Reads from the pin
     * @return {boolean} status
     */
    read(): boolean;
    /**
     * Writes to the pin
     * @param {boolean} status
     */
    write(status: boolean): void;
    /**
     * Binds an event listener to the pin
     * @param {string}   event
     * @param {function} handler
     */
    addEventListener(event: string, handler: any): void;
    /**
     * Removes a bound event listener
     * @param  {string}   event
     * @param  {function} handler
     */
    removeEventListener(event: string, handler?: any): void;
}
export declare enum PinLayout {
    wpi = 0,
    gpio = 1,
    sys = 2,
    phys = 3,
}
export declare enum PinModes {
    input = 0,
    output = 1,
}
export declare class WiringPiWrapper {
    private static pinLayoutMap;
    private static pinModeMap;
    static setup(mode: PinLayout): void;
    /**
     * Initializes a Pin object
     * @param  {number}   pin
     * @param  {PinModes} mode
     * @return {Pin}
     */
    static setupPin(pin: number, mode: PinModes): Pin;
}
