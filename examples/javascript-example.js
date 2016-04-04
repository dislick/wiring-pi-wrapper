var wpw = require('./wiring-pi-wrapper').WiringPiWrapper;
var pinModes = require('./wiring-pi-wrapper').PinModes;

wpw.setup('wpi');

var pin = wpw.setupPin(3, pinModes.output);
pin.write(true);
var status = pin.read();

var pin2 = wpw.setupPin(3, pinModes.input);
pin2.addEventListener('change', (status) => {
  console.log(status);
});
