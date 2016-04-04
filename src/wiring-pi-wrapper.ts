/// <reference path="typings/tsd.d.ts" />

let wpi = require('wiring-pi');

class Pin {
  private eventListeners = [];

  constructor(private pinNumber: number, private mode: PinModes) {
  }

  read(): boolean {
    return !!wpi.digitalRead(this.pinNumber);
  }

  write(status: boolean): void {
    wpi.digitalWrite(this.pinNumber, +status);
  }

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

  removeEventListener(event: string, handler?: any) {
    this.eventListeners = this.eventListeners.filter((listener) => {
      return listener.event === event && listener.handler === listener;
    });
  }

  private bindChangeListener(handler: (status: boolean) => void): void {
    let previousOutput;
    let check = () => {
      if (!this.eventListeners.some(listener => listener.handler === handler)) {
        return;
      }

      let output = this.read();

      if (output !== previousOutput) {
        previousOutput = null;
        handler(output);
      }

      previousOutput = output;
      setTimeout(check, 0);
    };

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

  static setupPin(pin: number, mode: PinModes): Pin {
    wpi.pinMode(pin, WiringPiWrapper.pinModeMap[mode]);
    return new Pin(pin, mode);
  }
}
