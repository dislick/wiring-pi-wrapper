/// <reference path="typings/tsd.d.ts" />

let wpi = require('wiring-pi');

/**
 * Handles all read/write operations on a given GPIO Pin
 */
export class Pin {
  private eventListeners = [];

  constructor(private pinNumber: number, private mode: PinModes) {
  }

  /**
   * Reads from the pin
   * @return {boolean} status
   */
  read(): boolean {
    return !!wpi.digitalRead(this.pinNumber);
  }

  /**
   * Writes to the pin
   * @param {boolean} status
   */
  write(status: boolean): void {
    wpi.digitalWrite(this.pinNumber, +status);
  }

  /**
   * Binds an event listener to the pin
   * @param {string}   event
   * @param {function} handler
   */
  addEventListener(event: string, handler: any): void {
    this.eventListeners.push({ event, handler });

    switch (event) {
      case 'change':
        this.bindChangeListener(handler);
        break;
      default:
        this.removeEventListener(event, handler);
        break;
    }
  }

  /**
   * Removes a bound event listener
   * @param  {string}   event
   * @param  {function} handler
   */
  removeEventListener(event: string, handler?: any): void {
    this.eventListeners = this.eventListeners.filter((listener) => {
      return listener.event === event && (!handler || listener.handler === handler);
    });
  }

  /**
   * Dirty checking the pin output and notifiying listeners
   * @param  {function} handler
   */
  private bindChangeListener(handler: (status: boolean) => void): void {
    // used to compare the output and detecting changes
    let previousOutput;

    // declare recursive check function
    let check = () => {
      // abort if the handler has been removed using pin.removeEventListener()
      if (!this.eventListeners.some(listener => listener.handler === handler)) {
        return;
      }

      let output = this.read();

      if (output !== previousOutput) {
        // reset the comparing variable
        previousOutput = null;

        // notifying handler
        handler(output);
      }

      previousOutput = output;
      // call check asynchronously
      setTimeout(check, 0);
    };

    // initial check call
    check();
  }
}

export enum PinModes {
  input,
  output
}

export class WiringPiWrapper {
  private static pinModeMap = {
    0: wpi.INPUT,
    1: wpi.OUTPUT
  };

  static setup(mode: string): void {
    wpi.setup(mode);
  }

  /**
   * Initializes a Pin object
   * @param  {number}   pin
   * @param  {PinModes} mode
   * @return {Pin}
   */
  static setupPin(pin: number, mode: PinModes): Pin {
    // set pinMode on the given pin
    wpi.pinMode(pin, WiringPiWrapper.pinModeMap[mode]);

    // instantiate a new Pin object
    return new Pin(pin, mode);
  }
}
