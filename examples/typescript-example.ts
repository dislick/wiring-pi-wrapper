import { WiringPiWrapper, PinModes } from '../src/wiring-pi-wrapper';

// setup the pin layout
WiringPiWrapper.setup('wpi');

// write example
var pin = WiringPiWrapper.setupPin(3, PinModes.output);
pin.write(true);

// read example
var pin = WiringPiWrapper.setupPin(2, PinModes.input);
var status = pin.read(); // returns a boolean

// event listener example
var pin = WiringPiWrapper.setupPin(2, PinModes.input);
pin.addEventListener('change', (status) => {
  console.log(status);
});