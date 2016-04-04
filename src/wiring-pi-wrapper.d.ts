/// <reference path="typings/tsd.d.ts" />
export declare class Pin {
    private pinNumber;
    private mode;
    private eventListeners;
    constructor(pinNumber: number, mode: PinModes);
    read(): boolean;
    write(status: boolean): void;
    addEventListener(event: string, handler: any): void;
    removeEventListener(event: string, handler?: any): void;
    private bindChangeListener(handler);
}
export declare enum PinModes {
    input = 0,
    output = 1,
}
export declare class WiringPiWrapper {
    private static pinModeMap;
    static setup(mode: string): void;
    static setupPin(pin: number, mode: PinModes): Pin;
}
