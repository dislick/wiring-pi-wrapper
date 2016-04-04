# wiring-pi-wrapper

This small node module provides a wrapper around [wiring-pi](https://github.com/eugeneware/wiring-pi).

## Usage

```
var wpw = require('wiring-pi-wrapper');
wpw.setup('wpi');

var pin = wpw.setupPin(17, wpw.modes.OUTPUT);
pin.write(true);
var status = pin.read();

var pin = wpw.setupPin(17, wpw.modes.INPUT);
pin.on('change', (status) => {
  console.log(status);
});
```

## API

### wpw
#### `wpw.setup(mode: string)`
Maps directly to the `wiring-pi``setup()` function. Mode must be one of the following values:

* `wpi`: sets up pin numbering with `wiringPiSetup()`
* `gpio`: sets up pin numbering with `wiringPiSetupGpio()`
* `sys`: sets up pin numbering with `wiringPiSetupSys()`
* `phys`: sets up pin numbering with `wiringPiSetupPhys()`

More information [can be found here](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#setupmode).

#### `wpw.setupPin(pin: number, mode: wpw.mode)`
Creates a new `Pin` object and executes the [`pinMode()`](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#pinmodepin-mode) function.

### Pin

#### `pin.read()`

Synchronously returns the status of the pin as a boolean. 

#### `pin.write(status: boolean)`

Synchronously writes a status to the pin.

#### `pin.on(event: string, handler: function)`

Binds one of the following events to the pin.

* `change`: Fires when the status of the pin changes. The `handler` function receives the status as a paramter.