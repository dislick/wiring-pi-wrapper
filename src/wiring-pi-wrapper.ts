/// <reference path="typings/tsd.d.ts" />

let wpi = require('wiring-pi');

export class ChangeWorker {
  private static eventListeners: { pin: Pin, handlers: any[], previousOutput?: boolean }[] = [];
  private static isWorking = false;
  static interval = 5; // declares the interval for the worker

  /**
   * Adds a handler to the loop
   * @param  {Pin}      pin
   * @param  {function} handler
   */
  static add(pin: Pin, handler: any): void {
    let listeners = ChangeWorker.eventListeners.filter(eventListener => eventListener.pin === pin);

    if (listeners.length <= 0) {
      ChangeWorker.eventListeners.push({
        pin,
        handlers: [handler]
      });
    } else {
      listeners[0].handlers.push(handler);
    }

    if (!ChangeWorker.isWorking) {
      ChangeWorker.start();
    }
  }

  /**
   * Removes a handler from the loop
   * @param  {Pin}      pin
   * @param  {function} handler
   */
  static remove(pin: Pin, handler: any): void {
    let listeners = ChangeWorker.eventListeners.filter(eventListener => eventListener.pin === pin);

    if (listeners.length > 0) {
      listeners[0].handlers = listeners[0].handlers.filter(h => h !== handler);

      if (listeners[0].handlers.length === 0) {
        ChangeWorker.eventListeners.splice(ChangeWorker.eventListeners.indexOf(listeners[0]), 1);
      }
    }

    if (ChangeWorker.eventListeners.length === 0) {
      ChangeWorker.stop();
    }
  }

  private static work() {
    let run = () => {
      ChangeWorker.eventListeners.forEach((listener) => {
        let output = listener.pin.read();

        if (output !== listener.previousOutput) {
          // reset the comparing variable
          listener.previousOutput = null;

          // notifying handlers
          listener.handlers.forEach(handler => handler(output));
        }

        listener.previousOutput = output;
      });

      // call run asynchronously
      if (ChangeWorker.isWorking) {
        setTimeout(run, ChangeWorker.interval);
      }
    };
    run();
  }

  private static start() {
    ChangeWorker.isWorking = true;
    ChangeWorker.work();
  }

  private static stop() {
    ChangeWorker.isWorking = false;
  }
}

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
        ChangeWorker.add(this, handler);
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

    switch (event) {
      case 'change':
        ChangeWorker.remove(this, handler);
        break;
      default:
        break;
    }
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
