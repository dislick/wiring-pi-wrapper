var wpw = require('./wiring-pi-wrapper').WiringPiWrapper;
var pinModes = require('./wiring-pi-wrapper').PinModes;

var pin = wpw.setupPin(17, pinModes.input);