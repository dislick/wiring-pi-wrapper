class Pin {
  constructor(pinNumber: number) {

  }

  read(): boolean {
    return true;
  }

  write(status: boolean): void {

  }

  addEventListener(event: string, handler: () => void): void {

  }

  removeEventListener(event: string) {

  }
}

export enum PinModes {
  input,
  output
}

export class WiringPiWrapper {

  static setup(mode: string): void {

  }

  static setupPin(pin: number, mode: PinModes): Pin {
    return new Pin(pin);
  }
}

