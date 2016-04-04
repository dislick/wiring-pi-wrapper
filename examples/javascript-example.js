var wpw = require('./wiring-pi-wrapper').WiringPiWrapper;
var pinModes = require('./wiring-pi-wrapper').PinModes;

// setup the pin layout
wpw.setup('wpi');

// write example
var pin = wpw.setupPin(3, pinModes.output);
pin.write(true);

// read example
var pin = wpw.setupPin(2, pinModes.input);
var status = pin.read(); // returns a boolean

// event listener example
var pin = wpw.setupPin(2, pinModes.input);
pin.addEventListener('change', (status) => {
  console.log(status);
});
