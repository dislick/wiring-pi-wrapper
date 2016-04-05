var wpw = require('wiring-pi-wrapper').WiringPiWrapper;
var pinModes = require('wiring-pi-wrapper').PinModes;
var ChangeWorker = require('wiring-pi-wrapper').ChangeWorker;

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
ChangeWorker.interval = 50; // sets the worker interval
pin.addEventListener('change', (status) => {
  console.log(status);
});
